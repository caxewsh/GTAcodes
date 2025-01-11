export interface Game {
    title: string;
    image: any;
    description: string;
    platforms: string[];
  }
  
  // Ensure all keys are lowercase for consistency
  export const platformGames: Record<string, Game[]> = {
    playstation: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Voir les codes de GTA V ➡️', platforms: ['playstation', 'xbox', 'pc'] },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Voir les codes de GTA San Andreas ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Voir les codes de GTA Vice City ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Voir les codes de GTA III ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
    ],
    xbox: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Voir les codes de GTA V ➡️', platforms: ['playstation', 'xbox', 'pc'] },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Voir les codes de GTA San Andreas ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Voir les codes de GTA Vice City ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Voir les codes de GTA III ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
    ],
    pc: [
      { title: 'GTA V', image: require('../assets/games/GTA5.jpg'), description: 'Voir les codes de GTA V ➡️', platforms: ['playstation', 'xbox', 'pc'] },
      { title: 'GTA IV', image: require('../assets/games/GTA4.jpg'), description: 'Bientôt disponible ⏳', platforms: ['playstation', 'xbox', 'pc'] },
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Voir les codes de GTA San Andreas ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Voir les codes de GTA Vice City ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Voir les codes de GTA III ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
    ],
    mobile: [
      { title: 'GTA San Andreas', image: require('../assets/games/GTASA.jpg'), description: 'Voir les codes de GTA San Andreas ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
      { title: 'GTA Vice City', image: require('../assets/games/GTAVC.jpg'), description: 'Voir les codes de GTA Vice City ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
      { title: 'GTA III', image: require('../assets/games/GTA3.jpg'), description: 'Voir les codes de GTA III ➡️', platforms: ['playstation', 'xbox', 'pc', 'mobile'] },
    ],
  };

export const comingSoonGames: Game[] = [
  { 
    title: 'GTA VI', 
    image: require('../assets/games/GTA6.jpg'), 
    description: 'Bientôt disponible ⏳', 
    platforms: ['playstation', 'xbox']
  },
  { 
    title: 'GTA IV', 
    image: require('../assets/games/GTA4.jpg'), 
    description: 'Bientôt disponible ⏳', 
    platforms: ['playstation', 'xbox', 'pc']
  },
];