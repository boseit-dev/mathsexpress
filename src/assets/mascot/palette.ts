/**
 * The capybara's colours, taken from the MathsExpress mascot design sheets. Artwork colours live
 * here rather than in `tokens.css` so the exported SVG and PNG files are self-contained. Every
 * pose and view uses only these values, which keeps the character identical everywhere.
 */
export const mascotPalette = {
  body: '#E8B274',
  bodyDark: '#C98B52',
  /** The far leg and arm in side views: a touch darker so the near limbs read in front. */
  bodyFar: '#B97D47',
  belly: '#F6D7AB',
  snout: '#8B5E3C',
  nostril: '#5E3B22',
  feet: '#8B5E3C',
  feetFar: '#76502F',
  earInner: '#8B5E3C',
  eye: '#2B2B2B',
  brow: '#4A4A4A',
  highlight: '#FFFFFF',
  shadow: 'rgba(27, 33, 66, 0.12)',
} as const;

/** Colours for the props the mascot holds or stands beside. Brand blues come from tokens.css. */
export const propPalette = {
  brandBlue: '#3D52A0',
  brandSky: '#7091E6',
  brandSoft: '#ADBBDA',
  brandPale: '#EDE8F5',
  violet: '#8752E8',
  teal: '#2E9C9A',
  tealDark: '#237F7D',
  page: '#F4FBFA',
  paper: '#FFFFFF',
  ink: '#2B2B2B',
  gold: '#F2B630',
  goldDark: '#D08C1F',
  goldLight: '#FFE08A',
  coral: '#F28C7A',
  grey: '#5B6478',
  greyLight: '#E9ECF3',
  screen: '#CFEFE2',
  wall: '#C9D2EA',
  wallDark: '#ADBBDA',
  desk: '#ADBBDA',
  deskDark: '#8697C4',
  bulb: '#FFD54A',
  bulbGlow: '#FFF3C4',
} as const;
