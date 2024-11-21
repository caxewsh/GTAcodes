interface Game {
    title: string;
    image: any;
    description: string;
  }
  
  // Ensure all keys are lowercase for consistency
  export const platformGames: Record<string, Game[]> = {
    playstation: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Back in Los Santos' },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Here we go again...' },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Tommy Vercetti vibes' },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Mafia rules' },
    ],
    xbox: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Description of GTA V' },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Here we go again...' },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Description of GTA Vice City' },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Description of GTA III' },
    ],
    pc: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Description of GTA V' },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Here we go again...' },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Description of GTA Vice City' },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Description of GTA III' },
    ],
    mobile: [
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Here we go again...' },
      { title: 'GTA VICE CITY', image: require('../assets/games/GTAVC.jpg'), description: 'Description of GTA Vice City' },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Description of GTA III' },
    ],
  };