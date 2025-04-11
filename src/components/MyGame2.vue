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
          scene: {
            preload: function () {
              console.log('Cargando recursos...');
              this.load.image('background', '/assets/background/sky.png'); // Asegúrate de tener una imagen en esta ruta
              this.load.image('player', '/assets/player/phaser-dude.png');
            },
            create: function () {
              //Añadir fondo
              const bg = this.add.image(0, 0, 'background');
              bg.setOrigin(0, 0); // Asegura que el fondo comience desde la esquina superior izquierda
              bg.setScale(800 / 2826, 600 / 1536); // Escala el fondo para ajustarlo al tamaño del juego


              // Crear el jugador
              this.player = this.physics.add.sprite(400, 300, 'player');
              this.player.setCollideWorldBounds(true); // Evita que salga de la pantalla
  
              // Configurar controles
              this.cursors = this.input.keyboard.createCursorKeys();
            },
            update: function () {
              // Movimiento del jugador
              console.log('Actualizando...');
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
            },
          },
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
  </script>
  
  <style scoped>
  #game-container {
    margin: 0 auto;
    width: 800px;
    height: 600px;
  }
  </style>