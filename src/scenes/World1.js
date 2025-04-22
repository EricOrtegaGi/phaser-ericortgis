import Phaser from 'phaser';

export default class World1 extends Phaser.Scene {
  constructor() {
    super({ key: 'World1' });
  }

  preload() {
    // Cargar spritesheet del jugador
    this.load.spritesheet('player', 'assets/player/spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image('background', 'assets/background/sky.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.audio('walk', 'assets/sounds/walk.mp3');
  }

  create() {
    // Configurar mundo más grande
    this.physics.world.setBounds(0, 0, 2000, 600);

    // Agregar fondo (escalado para cubrir el mundo)
    this.add.image(1000, 300, 'background').setDisplaySize(2000, 600);

    // Habilitar físicas Arcade
    this.physics.world.gravity.y = 1000;

    // Crear el jugador
    this.player = this.physics.add.sprite(100, 450, 'player', 0);
    this.player.body.setSize(64, 64);
    // this.player.setDisplaySize(64, 64); // Comentado para evitar problemas de corte
    this.player.setCollideWorldBounds(true);

    // Hacer que la cámara siga al jugador
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 2000, 600);

    // Crear animación de caminar
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 1, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    // Configurar audio de pasos
    this.walkSound = this.sound.add('walk', {
      loop: true,
      volume: 0.5,
    });

    // Crear el suelo (transparente, extendido a 2000 píxeles)
    const ground = this.physics.add.staticGroup();
    const groundSprite = ground.create(1000, 590, null).setDisplaySize(2000, 10).refreshBody();
    groundSprite.setAlpha(0);

    // Colisiones entre jugador y suelo
    this.physics.add.collider(this.player, ground);

    // Configurar teclas
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Sistema de vidas
    this.lives = 3;
    this.livesText = this.add.text(16, 16, `Vidas: ${this.lives}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '32px',
      color: '#ffff00', // Amarillo vibrante
      stroke: '#000000', // Borde negro
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        stroke: true,
        fill: true,
      },
    }).setScrollFactor(0);

    // Mostrar vidas gráficamente (círculos blancos)
    this.livesIcons = [];
    for (let i = 0; i < this.lives; i++) {
      const lifeIcon = this.add.circle(80 + i * 40, 40, 10, 0xffffff).setScrollFactor(0);
      this.livesIcons.push(lifeIcon);
    }

    // Sistema de recolección de objetos
    this.score = 0;
    this.scoreText = this.add.text(16, 50, `Puntuación: ${this.score}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '32px',
      color: '#ffff00', // Amarillo vibrante
      stroke: '#000000', // Borde negro
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        stroke: true,
        fill: true,
      },
    }).setScrollFactor(0);

    // Crear grupo de objetos recolectables
    this.collectibles = this.physics.add.group();
    this.collectibles.create(200, 450, 'coin').setDisplaySize(20, 20);
    this.collectibles.create(800, 400, 'coin').setDisplaySize(20, 20);
    this.collectibles.create(1400, 450, 'coin').setDisplaySize(20, 20);

    // Configurar monedas
    this.collectibles.children.iterate((coin) => {
      coin.body.setAllowGravity(false);
      return true;
    });

    // Colisiones entre jugador y objetos
    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.collectObject,
      null,
      this
    );

    // Inicializar bandera de movimiento
    this.isMoving = false;
  }

  collectObject(player, collectible) {
    collectible.destroy();
    this.score += 10;
    this.scoreText.setText(`Puntuación: ${this.score}`);
  }

  update() {
    // Movimiento horizontal
    if (this.keys.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play('walk', true);
      this.player.setFlipX(true);
      if (!this.isMoving) {
        this.isMoving = true;
        this.walkSound.play();
      }
    } else if (this.keys.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play('walk', true);
      this.player.setFlipX(false);
      if (!this.isMoving) {
        this.isMoving = true;
        this.walkSound.play();
      }
    } else {
      this.player.setVelocityX(0);
      this.player.anims.stop();
      this.player.setTexture('player', 0);
      if (this.isMoving) {
        this.isMoving = false;
        this.walkSound.stop();
      }
    }

    // Salto
    if (this.keys.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }
  }
}