/**
 * trackingRepository.ts
 *
 * Single source of truth for all BusTracking Prisma queries.
 * No SQL is scattered outside this file.
 * Controllers and services call these functions only.
 */

import prisma from '../prisma/client';
import { BusTracking } from '@prisma/client';

export type { BusTracking };

/**
 * Find a tracking record by driverId.
 * Returns null when no session has ever been started for this driver.
 */
export async function findByDriverId(driverId: string): Promise<BusTracking | null> {
  return prisma.busTracking.findUnique({
    where: { driverId },
  });
}

export interface UpsertLocationData {
  driverId: string;
  driverName: string;
  latitude: number;
  longitude: number;
  /** Unix ms timestamp from the Telegram update (message.date or message.edit_date) */
  lastUpdatedMs: number;
  /** If the message carries a live_period, pass it in seconds. Otherwise pass null. */
  livePeriodSeconds: number | null;
}

/**
 * Insert or update a driver's location after a Telegram location message arrives.
 *
 * trackingStartedAt is set only on the very first location message
 * (i.e. when no existing record exists OR when the prior session had expired).
 *
 * trackingExpiresAt = trackingStartedAt + live_period.
 * Fallback when live_period is absent: 15 minutes (900 seconds).
 * This is documented here because it is the single place this default is applied.
 */
export async function upsertLocation(data: UpsertLocationData): Promise<BusTracking> {
  const DEFAULT_LIVE_PERIOD_S = 900; // 15 minutes — Telegram minimum is 60s; 15 min is a safe default

  const existing = await prisma.busTracking.findUnique({
    where: { driverId: data.driverId },
  });

  const lastUpdated = new Date(data.lastUpdatedMs);
  const livePeriodS = data.livePeriodSeconds ?? DEFAULT_LIVE_PERIOD_S;
  const livePeriodMs = livePeriodS * 1000;

  // Determine trackingStartedAt:
  // - New record  → use lastUpdated as the start time
  // - Prior record exists AND prior session has expired → reset start time
  // - Prior record exists AND session still valid → keep the original start time
  const now = new Date();
  const priorSessionExpired =
    existing?.trackingExpiresAt == null || existing.trackingExpiresAt <= now;

  const trackingStartedAt =
    !existing || priorSessionExpired ? lastUpdated : (existing.trackingStartedAt ?? lastUpdated);

  const trackingExpiresAt = new Date(trackingStartedAt.getTime() + livePeriodMs);

  return prisma.busTracking.upsert({
    where: { driverId: data.driverId },
    create: {
      driverId: data.driverId,
      driverName: data.driverName,
      latitude: data.latitude,
      longitude: data.longitude,
      lastUpdated,
      trackingStartedAt,
      trackingExpiresAt,
    },
    update: {
      driverName: data.driverName,
      latitude: data.latitude,
      longitude: data.longitude,
      lastUpdated,
      // Only reset trackingStartedAt / trackingExpiresAt when starting a fresh session
      ...(priorSessionExpired && {
        trackingStartedAt,
        trackingExpiresAt,
      }),
      // If the session is still valid, extend expiry only if live_period is explicitly provided
      ...(!priorSessionExpired &&
        data.livePeriodSeconds !== null && {
          trackingExpiresAt,
        }),
    },
  });
}

/**
 * Stamp the lastRequestSent field so the Decision Engine can prevent
 * duplicate Telegram requests within a short window.
 */
export async function updateLastRequestSent(driverId: string, driverName: string): Promise<void> {
  await prisma.busTracking.upsert({
    where: { driverId },
    create: {
      driverId,
      driverName,
      lastRequestSent: new Date(),
    },
    update: {
      lastRequestSent: new Date(),
    },
  });
}
