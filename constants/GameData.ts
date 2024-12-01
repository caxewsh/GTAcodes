interface Game {
    title: string;
    image: any;
    description: string;
  }
  
  // Ensure all keys are lowercase for consistency
  export const platformGames: Record<string, Game[]> = {
    playstation: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Voir les codes de GTA V ➡️' },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Voir les codes de GTA San Andreas ➡️' },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Voir les codes de GTA Vice City ➡️' },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Voir les codes de GTA III ➡️' },
    ],
    xbox: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Voir les codes de GTA V ➡️' },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Voir les codes de GTA San Andreas ➡️' },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Voir les codes de GTA Vice City ➡️' },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Voir les codes de GTA III ➡️' },
    ],
    pc: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Voir les codes de GTA V ➡️' },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Voir les codes de GTA San Andreas ➡️' },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Voir les codes de GTA Vice City ➡️' },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Voir les codes de GTA III ➡️' },
    ],
    mobile: [
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Voir les codes de GTA San Andreas ➡️' },
      { title: 'GTA VICE CITY', image: require('../assets/games/GTAVC.jpg'), description: 'Voir les codes de GTA Vice City ➡️' },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Voir les codes de GTA III ➡️' },
    ],
  };