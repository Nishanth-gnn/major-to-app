import jsQR from 'jsqr';

export interface BoardingPassData {
  ticket_id: string;
  passenger_name: string;
  flight_id: string;
  date: string;
  from: string;
  to: string;
  terminal: string;
  seat: string;
  // Legacy field aliases for backwards compat
  name?: string;
  seat_no?: string;
}

export const decodeQRImage = (file: File): Promise<BoardingPassData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to create canvas context'));
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        try {
          const parsed = JSON.parse(code.data);

          // Normalise: support both old and new field names
          const normalised: BoardingPassData = {
            ticket_id:      parsed.ticket_id   || parsed.id         || 'N/A',
            passenger_name: parsed.passenger_name || parsed.name    || 'Unknown',
            flight_id:      parsed.flight_id   || parsed.flightId   || 'N/A',
            date:           parsed.date                             || 'N/A',
            from:           parsed.from                             || 'N/A',
            to:             parsed.to                               || 'N/A',
            terminal:       parsed.terminal                         || 'N/A',
            seat:           parsed.seat        || parsed.seat_no    || 'N/A',
          };

          // At minimum need passenger_name + flight_id
          if (normalised.passenger_name === 'Unknown' && normalised.flight_id === 'N/A') {
            reject(new Error('QR code does not contain valid boarding pass data'));
          } else {
            resolve(normalised);
          }
        } catch (e) {
          reject(new Error('QR code content is not valid JSON'));
        }
      } else {
        reject(new Error('No QR code found in the image'));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
};
