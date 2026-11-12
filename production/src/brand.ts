// Series design tokens (Sistema v0.1, episodes/03-vivienda/visuals/design).
// Editorial rule: the same colour means the same thing across the whole video,
// and no colour may read as a party colour. The four data colours also differ in
// lightness, not only in hue.
export const brand = {
  name: 'NO ES TAN SENCILLO',
  /** Noche: the background of every frame. */
  night: '#0B0E14',
  /** Marfil: main text, the deficit, R1. */
  ivory: '#F2EDE4',
  text: '#EEF1F5',
  /** Secondary text; both pass 4.5:1 on night. */
  soft: '#B7C0CC',
  muted: '#8893A3',
  faint: '#5A6475',
  rule: '#2A3444',
  edge: '#3A4558',
  panel: '#121722',
  panelDeep: '#0F141C',
  chip: '#1B2230',
  tile: '#2B3445',
  ground: '#10151E',
  /** Fonts. Archivo is used condensed (font-stretch 75%) for figures and titles. */
  display: 'Archivo',
  serif: '"Instrument Serif"',
  sans: 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: '"IBM Plex Mono", Menlo, monospace',
  /** Fixed meaning per quantity. */
  data: {
    hogares: '#F5B85A',
    terminadas: '#7FE0C2',
    vacias: '#6F819A',
    turisticos: '#C7A4FF',
    deficit: '#F2EDE4',
    viviendas: '#2B3445',
  },
  // Aliases kept for the built-in cards and older visuals.
  paper: '#0B0E14',
  ink: '#EEF1F5',
  accent: '#F2EDE4',
  dark: '#0B0E14',
  darkMuted: '#B7C0CC',
} as const;

export type DataColour = keyof typeof brand.data;
export const colour = (c?: string) => (c && c in brand.data ? brand.data[c as DataColour] : c) ?? brand.ivory;
