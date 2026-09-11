export default function manifest() {
  return {
    name: 'Paparazzi',
    short_name: 'Paparazzi',
    description: 'Fotky a videá od hostí priamo do vášho Google Drive.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf7f0',
    theme_color: '#fbf7f0',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
