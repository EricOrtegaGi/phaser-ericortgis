import Phaser from 'phaser';
import { useGameStore } from '../../stores/game';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    // Fondo negro con efecto de brillo
    this.cameras.main.setBackgroundColor('#000000');
    this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.8
    ).setBlendMode(Phaser.BlendModes.ADD);

    // Título con efecto de brillo
    const title = this.add.text(
      this.cameras.main.centerX,
      100,
      '¿?',
      { 
        fontSize: '48px', 
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#00ffff',
        strokeThickness: 2,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#00ffff',
          blur: 8,
          stroke: true,
          fill: true
        }
      }
    ).setOrigin(0.5);

    // Contenedor de botones
    const menuContainer = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );

    // Botón Nueva Partida
    const newGameButton = this.add.rectangle(
      0,
      -50,
      250,
      60,
      0x00ff00
    ).setInteractive();

    const newGameText = this.add.text(
      0,
      -50,
      'Nueva Partida',
      { 
        fontSize: '20px', 
        color: '#000000',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Botón Cargar Partida
    const loadGameButton = this.add.rectangle(
      0,
      30,
      250,
      60,
      0x0000ff
    ).setInteractive();

    const loadGameText = this.add.text(
      0,
      30,
      'Cargar Partida',
      { 
        fontSize: '20px', 
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Botón de sonido
    const soundButton = this.add.circle(
      0,
      120,
      30,
      0xffff00
    ).setInteractive();

    const soundText = this.add.text(
      0,
      120,
      '♪',
      { 
        fontSize: '20px', 
        color: '#000000',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Añadir elementos al contenedor
    menuContainer.add([
      newGameButton,
      newGameText,
      loadGameButton,
      loadGameText,
      soundButton,
      soundText
    ]);

    // Efectos hover para los botones
    newGameButton.on('pointerover', () => {
      newGameButton.setScale(1.05);
      newGameButton.setFillStyle(0x00ff00, 0.8);
    });

    newGameButton.on('pointerout', () => {
      newGameButton.setScale(1);
      newGameButton.setFillStyle(0x00ff00);
    });

    loadGameButton.on('pointerover', () => {
      loadGameButton.setScale(1.05);
      loadGameButton.setFillStyle(0x0000ff, 0.8);
    });

    loadGameButton.on('pointerout', () => {
      loadGameButton.setScale(1);
      loadGameButton.setFillStyle(0x0000ff);
    });

    soundButton.on('pointerover', () => {
      soundButton.setScale(1.1);
      soundButton.setFillStyle(0xffff00, 0.8);
    });

    soundButton.on('pointerout', () => {
      soundButton.setScale(1);
      soundButton.setFillStyle(0xffff00);
    });

    // Eventos de los botones
    newGameButton.on('pointerdown', () => {
      this.startNewGame();
    });

    loadGameButton.on('pointerdown', () => {
      this.showSavedGames();
    });

    let isSoundOn = true;
    soundButton.on('pointerdown', () => {
      isSoundOn = !isSoundOn;
      this.sound.mute = !isSoundOn;
      soundText.setText(isSoundOn ? '♪' : 'X');
    });

    // Cargar partidas guardadas
    this.gameStore = useGameStore();
    this.gameStore.loadSavedGames();

    // Mostrar mejores puntuaciones si existen
    if (this.gameStore.highScores.length > 0) {
      this.showHighScores();
    }
  }

  showHighScores() {
    const y = this.cameras.main.centerY + 180;
    
    // Título de mejores puntuaciones
    this.add.text(
      this.cameras.main.centerX,
      y,
      'Mejores Puntuaciones',
      { 
        fontSize: '20px', 
        color: '#00ffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Lista de puntuaciones
    this.gameStore.highScores.forEach((score, index) => {
      const scoreText = this.add.text(
        this.cameras.main.centerX,
        y + 30 + (index * 25),
        `${score.score} puntos - ${new Date(score.date).toLocaleDateString()}`,
        { 
          fontSize: '16px', 
          color: '#ffffff'
        }
      ).setOrigin(0.5);
    });
  }

  startNewGame() {
    this.gameStore.startGame();
    this.scene.start('World1');
  }

  showSavedGames() {
    // Crear fondo semitransparente con efecto de brillo
    const background = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      450,
      400,
      0x000000,
      0.8
    ).setInteractive()
    .setBlendMode(Phaser.BlendModes.ADD);

    // Título con efecto de brillo
    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 180,
      'Partidas Guardadas',
      { 
        fontSize: '24px', 
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#00ffff',
        strokeThickness: 2,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#00ffff',
          blur: 8,
          stroke: true,
          fill: true
        }
      }
    ).setOrigin(0.5);

    // Lista de partidas guardadas
    const savedGames = this.gameStore.sortedSavedGames;
    if (savedGames.length === 0) {
      this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'No hay partidas guardadas',
        { 
          fontSize: '20px', 
          color: '#ffffff',
          fontStyle: 'bold'
        }
      ).setOrigin(0.5);
    } else {
      savedGames.forEach((game, index) => {
        const y = this.cameras.main.centerY - 100 + (index * 70);
        
        // Información de la partida
        const gameText = this.add.text(
          this.cameras.main.centerX - 120,
          y,
          `Partida ${index + 1}\nPuntuación: ${game.score}\nMundo: ${game.currentWorld}`,
          { 
            fontSize: '18px', 
            color: '#ffffff',
            fontStyle: 'bold'
          }
        );

        // Botón de carga
        const loadButton = this.add.rectangle(
          this.cameras.main.centerX + 100,
          y + 10,
          100,
          40,
          0x00ff00
        ).setInteractive();

        const loadText = this.add.text(
          this.cameras.main.centerX + 100,
          y + 10,
          'Cargar',
          { 
            fontSize: '16px', 
            color: '#000000',
            fontStyle: 'bold'
          }
        ).setOrigin(0.5);

        // Efecto hover para el botón de carga
        loadButton.on('pointerover', () => {
          loadButton.setScale(1.05);
          loadButton.setFillStyle(0x00ff00, 0.8);
        });

        loadButton.on('pointerout', () => {
          loadButton.setScale(1);
          loadButton.setFillStyle(0x00ff00);
        });

        // Botón de eliminación
        const deleteButton = this.add.rectangle(
          this.cameras.main.centerX + 200,
          y + 10,
          100,
          40,
          0xff0000
        ).setInteractive();

        const deleteText = this.add.text(
          this.cameras.main.centerX + 200,
          y + 10,
          'Eliminar',
          { 
            fontSize: '16px', 
            color: '#ffffff',
            fontStyle: 'bold'
          }
        ).setOrigin(0.5);

        // Efecto hover para el botón de eliminación
        deleteButton.on('pointerover', () => {
          deleteButton.setScale(1.05);
          deleteButton.setFillStyle(0xff0000, 0.8);
        });

        deleteButton.on('pointerout', () => {
          deleteButton.setScale(1);
          deleteButton.setFillStyle(0xff0000);
        });

        // Eventos de los botones
        loadButton.on('pointerdown', () => {
          this.loadGame(index);
          background.destroy();
        });

        deleteButton.on('pointerdown', () => {
          this.deleteGame(index);
          background.destroy();
          this.showSavedGames();
        });
      });
    }

    // Botón de cerrar
    const closeButton = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 150,
      120,
      50,
      0x666666
    ).setInteractive();

    const closeText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 150,
      'Cerrar',
      { 
        fontSize: '18px', 
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Efecto hover para el botón de cerrar
    closeButton.on('pointerover', () => {
      closeButton.setScale(1.05);
      closeButton.setFillStyle(0x666666, 0.8);
    });

    closeButton.on('pointerout', () => {
      closeButton.setScale(1);
      closeButton.setFillStyle(0x666666);
    });

    closeButton.on('pointerdown', () => {
      background.destroy();
    });
  }

  loadGame(index) {
    const playerData = this.gameStore.loadGame(index);
    if (playerData) {
      this.game.registry.set('playerData', playerData);
      this.scene.start(`World${this.gameStore.currentWorld}`);
    } else {
      this.showError('Error al cargar la partida');
    }
  }

  deleteGame(index) {
    this.gameStore.deleteSavedGame(index);
  }

  showError(message) {
    const errorText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 200,
      message,
      { 
        fontSize: '20px', 
        color: '#ff0000',
        fontStyle: 'bold',
        stroke: '#ffffff',
        strokeThickness: 2
      }
    ).setOrigin(0.5);

    // Hacer desaparecer el mensaje después de 2 segundos
    this.time.delayedCall(2000, () => {
      errorText.destroy();
    });
  }
}