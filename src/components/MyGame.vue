<template>
  <div id="game-container"></div>
</template>

<script>
import Phaser from 'phaser';

export default {
name: 'MyGame',
mounted() {
  this.initPhaser();
},
methods: {
  initPhaser() {
    console.log('Iniciando Phaser...');
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      scene: [MainMenuScene, GameScene], // Añadimos las dos escenas
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 10000 },
        },
      },
    };

    this.game = new Phaser.Game(config);
  },
},
beforeUnmount() {
  if (this.game) {
    this.game.destroy(true);
  }
},
};

// Escena del menú principal
class MainMenuScene extends Phaser.Scene {
constructor() {
  super({ key: 'MainMenuScene' });
}

preload() {
  console.log('Cargando recursos del menú...');
  this.load.image('menuBackground', '/assets/background/menu-background.png'); // Fondo del menú
}

create() {
  // Añadir fondo del menú
  const bg = this.add.image(0, 0, 'menuBackground');
  bg.setOrigin(0, 0);
  bg.setScale(800 / 2826, 600 / 1536);

  // Añadir texto interactivo para iniciar el juego
  const startText = this.add.text(400, 300, 'Iniciar Juego', {
    fontSize: '32px',
    color: '#ffffff',
  });
  startText.setOrigin(0.5, 0.5);
  startText.setInteractive();

  // Cambiar a la escena del juego al hacer clic
  startText.on('pointerdown', () => {
    this.scene.start('GameScene');
  });
}
}

// Escena del juego principal
class GameScene extends Phaser.Scene {
constructor() {
  super({ key: 'GameScene' });
}

preload() {
  console.log('Cargando recursos del juego...');
  this.load.image('background', '/assets/background/sky.png');
  this.load.image('player', '/assets/player/phaser-dude.png');
}

create() {
  // Añadir fondo
  const bg = this.add.image(0, 0, 'background');
  bg.setOrigin(0, 0);
  bg.setScale(800 / 2826, 600 / 1536);

  // Crear el jugador
  this.player = this.physics.add.sprite(400, 300, 'player');
  this.player.setCollideWorldBounds(true);

  // Configurar controles
  this.cursors = this.input.keyboard.createCursorKeys();
}

update() {
  // Movimiento del jugador
  const speed = 200;
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-speed);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(speed);
  } else {
    this.player.setVelocityX(0);
  }

  if (this.cursors.up.isDown) {
    this.player.setVelocityY(-speed);
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(speed);
  } else {
    this.player.setVelocityY(0);
  }
}
}
</script>

<style scoped>
#game-container {
margin: 0 auto;
width: 800px;
height: 600px;
}
</style>