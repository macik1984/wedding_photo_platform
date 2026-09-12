import './globals.css';
import './ui.css';
import { resolveLocale } from '@/lib/locale';

const TITLE = 'Paparazzi - fotky od hostí do vášho Google Drive';
const DESC =
  'Hostia naskenujú QR kód, pošlú fotky a videá a tie pristanú vo vašom Google Drive. Bez registrácie, bez aplikácie.';

export const metadata = {
  title: TITLE,
  description: DESC,
  applicationName: 'Paparazzi',
  openGraph: {
    title: 'Paparazzi',
    description: DESC,
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Paparazzi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paparazzi',
    description: DESC,
    images: ['/og.jpg'],
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eef1f7' },
    { media: '(prefers-color-scheme: dark)', color: '#06070c' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default async function RootLayout({ children }) {
  const locale = await resolveLocale();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter je zaloha pre zariadenia bez systemoveho SF Pro; stranky akcii
            si svoje pisma dotahuju samy podla nastavenia organizatora. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Alex+Brush&family=Cormorant+Garamond:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
