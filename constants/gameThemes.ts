interface GameTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const gameThemes: { [key: string]: GameTheme } = {
  'GTA III': {
    primary: '#333333',
    secondary: '#4A4A4A',
    background: '#1A1A1A',
    text: '#FFFFFF'
  },
  'GTA: Vice City': {
    primary: '#F47CC3',
    secondary: '#58D3F7',
    background: '#1A1A1A',
    text: '#FFFFFF'
  },
  'GTA: San Andreas': {
    primary: '#4E8C4A',
    secondary: '#2E5C2A',
    background: '#1A1A1A',
    text: '#FFFFFF'
  },
  'GTA V': {
    primary: '#93C83D',
    secondary: '#7AA832',
    background: '#1A1A1A',
    text: '#FFFFFF'
  },
  'default': {
    primary: '#E5F993',
    secondary: '#333333',
    background: '#000000',
    text: '#FFFFFF'
  }
};

export const getGameTheme = (gameName: string): GameTheme => {
  return gameThemes[gameName] || gameThemes.default;
}; 