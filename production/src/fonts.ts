// Load the series fonts before any Txt is laid out: Motion Canvas measures text
// when nodes are created, so a late font would leave every label mis-sized.
const families = [
  '900 64px Archivo', '800 64px Archivo', 'condensed 900 64px Archivo', 'condensed 800 64px Archivo',
  'italic 40px "Instrument Serif"', '40px "Instrument Serif"',
  '400 22px Inter', '500 22px Inter', '600 22px Inter',
  '400 16px "IBM Plex Mono"', '500 16px "IBM Plex Mono"',
];

if (typeof document !== 'undefined' && !document.querySelector('link[data-netes-fonts]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.dataset.netesFonts = '';
  link.href = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=block';
  document.head.appendChild(link);
  await new Promise<void>(resolve => { link.onload = () => resolve(); link.onerror = () => resolve(); });
  await Promise.all(families.map(f => document.fonts.load(f).catch(() => [])));
}

export {};
