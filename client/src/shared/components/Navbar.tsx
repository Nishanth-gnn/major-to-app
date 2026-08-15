import React, { useState } from 'react'
import AirportHeader from './AirportHeader'
import EnterpriseNavigation from './EnterpriseNavigation'
import NotificationCenterModal from './NotificationCenterModal'

export default function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <>
      <AirportHeader unreadCount={2} onOpenNotifications={() => setNotificationsOpen(true)} />
      <EnterpriseNavigation />
      <NotificationCenterModal open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  )
}
