import './globals.css';

export const metadata = {
  title: 'Paparazzi - fotky od hostí do vášho Google Drive',
  description:
    'Hostia naskenujú QR kód, pošlú fotky a videá a tie pristanú vo vašom Google Drive. Bez registrácie, bez aplikácie.',
};

export const viewport = {
  themeColor: '#fbf7f0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
