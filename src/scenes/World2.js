import Phaser from 'phaser';

export default class World2 extends Phaser.Scene {
  constructor() {
    super({ key: 'World2' });
  }

  preload() {
    // Cargar spritesheet del jugador
    this.load.spritesheet('player', 'assets/player/spritesheet.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image('background', 'assets/background/sky.png');
    this.load.audio('walk', 'assets/sounds/walk.mp3');
  }

  create() {
    try {
      // Configurar mundo más grande
      this.physics.world.setBounds(0, 0, 3000, 600);

      // Agregar fondo
      this.add.image(1500, 300, 'background').setDisplaySize(3000, 600);

      // Habilitar físicas Arcade
      this.physics.world.gravity.y = 875;

      // Crear el jugador
      this.player = this.physics.add.sprite(100, 450, 'player', 0);
      this.player.body.setSize(64, 64);
      this.player.setCollideWorldBounds(true);

      // Hacer que la cámara siga al jugador
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setBounds(0, 0, 3000, 600);

      // Crear animación de caminar del jugador
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

      // Crear el suelo (transparente)
      const ground = this.physics.add.staticGroup();
      const groundSprite = ground.create(1500, 590, null).setDisplaySize(3000, 10).refreshBody();
      groundSprite.setAlpha(0);

      // Crear plataformas para parkour (más desafiantes)
      const platforms = this.physics.add.staticGroup();
      
      // Primera sección - Plataformas ascendentes (más pequeñas y separadas)
      platforms.create(700, 450, null).setDisplaySize(80, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(850, 400, null).setDisplaySize(70, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(1000, 350, null).setDisplaySize(60, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(1150, 300, null).setDisplaySize(50, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      
      // Segunda sección - Plataformas móviles (simuladas con plataformas estáticas por ahora)
      platforms.create(1300, 250, null).setDisplaySize(40, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(1450, 200, null).setDisplaySize(40, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      
      // Tercera sección - Plataformas estrechas y separadas
      platforms.create(1600, 150, null).setDisplaySize(30, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(1700, 150, null).setDisplaySize(30, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(1800, 150, null).setDisplaySize(30, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);

      // Cuarta sección - Plataformas adicionales para hacer el nivel más largo
      platforms.create(2000, 200, null).setDisplaySize(50, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(2150, 250, null).setDisplaySize(50, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(2300, 200, null).setDisplaySize(50, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      
      // Plataforma final
      platforms.create(2500, 150, null).setDisplaySize(100, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);

      // Crear grupo de enemigos
      this.enemies = this.physics.add.group();

      // Enemigo 1 - Patrullando entre las primeras plataformas
      const enemy1 = this.enemies.create(900, 300, null);
      enemy1.setTint(0xff0000);
      enemy1.setDisplaySize(64, 64);
      enemy1.body.setSize(40, 40);
      enemy1.setCollideWorldBounds(true);
      enemy1.setVelocityX(100);
      enemy1.direction = 1;
      enemy1.isAggro = false;
      enemy1.patrolBounds = { minX: 850, maxX: 1150 };
      enemy1.health = 1; // Enemigo normal

      // Enemigo 2 - Patrullando en la sección de plataformas móviles (Jefe)
      const enemy2 = this.enemies.create(1300, 200, null);
      enemy2.setTint(0xff0000);
      enemy2.setDisplaySize(80, 80); // Más grande
      enemy2.body.setSize(50, 50); // Hitbox más grande
      enemy2.setCollideWorldBounds(true);
      enemy2.setVelocityX(100);
      enemy2.direction = 1;
      enemy2.isAggro = false;
      enemy2.patrolBounds = { minX: 1250, maxX: 1450 };
      enemy2.health = 2; // Necesita dos golpes
      enemy2.isBoss = true; // Marcar como jefe

      // Enemigo 3 - Patrullando en la sección de plataformas estrechas
      const enemy3 = this.enemies.create(1700, 100, null);
      enemy3.setTint(0xff0000);
      enemy3.setDisplaySize(64, 64);
      enemy3.body.setSize(40, 40);
      enemy3.setCollideWorldBounds(true);
      enemy3.setVelocityX(100);
      enemy3.direction = 1;
      enemy3.isAggro = false;
      enemy3.patrolBounds = { minX: 1600, maxX: 1800 };
      enemy3.health = 1; // Enemigo normal

      // Enemigo 4 - Patrullando en la sección final (Jefe)
      const enemy4 = this.enemies.create(2300, 150, null);
      enemy4.setTint(0xff0000);
      enemy4.setDisplaySize(80, 80); // Más grande
      enemy4.body.setSize(50, 50); // Hitbox más grande
      enemy4.setCollideWorldBounds(true);
      enemy4.setVelocityX(100);
      enemy4.direction = 1;
      enemy4.isAggro = false;
      enemy4.patrolBounds = { minX: 2250, maxX: 2350 };
      enemy4.health = 2; // Necesita dos golpes
      enemy4.isBoss = true; // Marcar como jefe

      // Crear cofre en la plataforma final
      this.chest = this.physics.add.sprite(2500, 100, null);
      this.chest.setTint(0x8B4513);
      this.chest.setDisplaySize(40, 40);
      this.chest.body.setAllowGravity(false);
      this.chest.isOpened = false;

      // Colisión con el cofre
      this.physics.add.overlap(this.player, this.chest, this.openChest, null, this);

      // Colisiones
      this.physics.add.collider(this.player, ground);
      this.physics.add.collider(this.player, platforms);
      this.physics.add.collider(this.enemies, ground);
      this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);

      // Crear grupo de objetos recolectables (monedas)
      this.collectibles = this.physics.add.group();
      
      // Monedas en la primera sección
      this.collectibles.create(700, 430, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(850, 380, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(1000, 330, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(1150, 280, null).setDisplaySize(20, 20).setTint(0xffff00);
      
      // Monedas en la segunda sección
      this.collectibles.create(1300, 230, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(1450, 180, null).setDisplaySize(20, 20).setTint(0xffff00);
      
      // Monedas en la tercera sección
      this.collectibles.create(1600, 130, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(1700, 130, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(1800, 130, null).setDisplaySize(20, 20).setTint(0xffff00);

      // Monedas en la cuarta sección
      this.collectibles.create(2000, 180, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(2150, 230, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(2300, 180, null).setDisplaySize(20, 20).setTint(0xffff00);

      // Configurar monedas
      this.collectibles.children.iterate((coin) => {
        coin.body.setAllowGravity(false);
        return true;
      });

      // Colisiones con monedas
      this.physics.add.overlap(
        this.player,
        this.collectibles,
        this.collectObject,
        null,
        this
      );

      // Configurar teclas
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        usePotion: Phaser.Input.Keyboard.KeyCodes.Q,
      });

      // Sistema de vidas
      const playerData = this.game.registry.get('playerData');
      if (playerData) {
        this.lives = playerData.lives;
        this.volatileLife = playerData.volatileLife;
        this.inventory = playerData.inventory;
        this.score = playerData.score;
      } else {
        this.lives = 3;
        this.volatileLife = 0;
        this.inventory = { potion: 0 };
        this.score = 0;
      }

      this.maxLives = 3;
      this.livesText = this.add.text(16, 16, `Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '32px',
        color: '#ffff00',
        stroke: '#000000',
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

      // Mostrar vidas gráficamente
      this.livesIcons = [];
      for (let i = 0; i < this.lives; i++) {
        const lifeIcon = this.add.circle(80 + i * 40, 40, 10, 0xffffff).setScrollFactor(0);
        this.livesIcons.push(lifeIcon);
      }
      if (this.volatileLife > 0) {
        const volatileIcon = this.add.circle(80 + this.lives * 40, 40, 10, 0xff0000).setScrollFactor(0);
        this.livesIcons.push(volatileIcon);
      }

      // Mostrar puntuación
      this.scoreText = this.add.text(16, 50, `Puntuación: ${this.score}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '32px',
        color: '#ffff00',
        stroke: '#000000',
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

      // Mostrar inventario
      this.inventoryText = this.add.text(16, 84, `Poción: ${this.inventory.potion} [Q para usar]`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '24px',
        color: '#00ff00',
        stroke: '#000000',
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

      // Inicializar bandera de movimiento
      this.isMoving = false;
    } catch (error) {
      console.error('Error en create():', error);
    }
  }

  update() {
    if (!this.keys) {
      console.warn('this.keys no está definido en update()');
      return;
    }

    // Movimiento del jugador
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

    // Usar poción con Q
    if (Phaser.Input.Keyboard.JustDown(this.keys.usePotion) && this.inventory.potion > 0 && this.lives < this.maxLives) {
      this.inventory.potion -= 1;
      this.inventoryText.setText(`Poción: ${this.inventory.potion} [Q para usar]`);
      this.lives += 1;
      this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
      const lifeIcon = this.add.circle(80 + (this.lives - 1) * 40, 40, 10, 0xffffff).setScrollFactor(0);
      this.livesIcons.push(lifeIcon);
    }

    // Movimiento de los enemigos (patrulla o aggro)
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy.active) {
        const distanceToPlayer = Math.abs(this.player.x - enemy.x);
        const aggroRange = 300;

        if (distanceToPlayer <= aggroRange) {
          enemy.isAggro = true;
          if (this.player.x < enemy.x) {
            enemy.setVelocityX(-150);
          } else {
            enemy.setVelocityX(150);
          }
        } else {
          enemy.isAggro = false;
          if (enemy.x >= enemy.patrolBounds.maxX) {
            enemy.direction = -1;
            enemy.setVelocityX(-100);
          } else if (enemy.x <= enemy.patrolBounds.minX) {
            enemy.direction = 1;
            enemy.setVelocityX(100);
          }
        }
      }
    });
  }

  openChest(player, chest) {
    if (chest.isOpened) return;

    chest.isOpened = true;
    chest.destroy();

    // Mostrar poción
    const potion = this.add.circle(2500, 100, 10, 0x00ff00).setDepth(1);
    this.tweens.add({
      targets: potion,
      y: 80,
      alpha: 0,
      duration: 1000,
      onComplete: () => potion.destroy(),
    });

    // Mostrar estrella
    const star = this.add.circle(2500, 100, 10, 0xffffff).setStrokeStyle(2, 0x000000).setDepth(1);
    this.tweens.add({
      targets: star,
      y: 120,
      alpha: 0,
      duration: 1000,
      onComplete: () => star.destroy(),
    });

    // Manejar la poción
    if (this.lives < this.maxLives) {
      this.lives += 1;
      this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
      const lifeIcon = this.add.circle(80 + (this.lives - 1) * 40, 40, 10, 0xffffff).setScrollFactor(0);
      this.livesIcons.push(lifeIcon);
    } else {
      this.inventory.potion += 1;
      this.inventoryText.setText(`Poción: ${this.inventory.potion} [Q para usar]`);
    }

    // Manejar la estrella
    if (this.lives < this.maxLives) {
      this.lives += 1;
      if (this.lives > this.maxLives) this.lives = this.maxLives;
      this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
      if (this.livesIcons.length < this.lives) {
        const lifeIcon = this.add.circle(80 + (this.lives - 1) * 40, 40, 10, 0xffffff).setScrollFactor(0);
        this.livesIcons.push(lifeIcon);
      }
    } else if (this.volatileLife === 0) {
      this.volatileLife = 1;
      this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
      const volatileIcon = this.add.circle(80 + this.lives * 40, 40, 10, 0xff0000).setScrollFactor(0);
      this.livesIcons.push(volatileIcon);
    }
  }

  handlePlayerEnemyCollision(player, enemy) {
    try {
      if (player.body.velocity.y > 0 && player.y < enemy.y) {
        // Si es un jefe, reducir su salud en lugar de destruirlo inmediatamente
        if (enemy.isBoss) {
          enemy.health -= 1;
          if (enemy.health <= 0) {
            enemy.destroy();
          }
        } else {
          enemy.destroy();
        }
        player.setVelocityY(-300);
      } else if (!this.isPlayerInvulnerable) {
        if (this.volatileLife > 0) {
          this.volatileLife = 0;
          this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
          this.livesIcons[this.livesIcons.length - 1].destroy();
          this.livesIcons.pop();
        } else {
          this.lives -= 1;
          this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
          this.livesIcons[this.livesIcons.length - 1].destroy();
          this.livesIcons.pop();
        }

        this.isPlayerInvulnerable = true;
        player.setAlpha(0.5);
        this.time.delayedCall(2000, () => {
          this.isPlayerInvulnerable = false;
          player.setAlpha(1);
        });

        if (this.lives <= 0 && this.volatileLife <= 0) {
          this.scene.restart();
        }
      }
    } catch (error) {
      console.error('Error en handlePlayerEnemyCollision:', error);
    }
  }

  collectObject(player, collectible) {
    collectible.destroy();
    this.score += 10;
    this.scoreText.setText(`Puntuación: ${this.score}`);
  }
} 