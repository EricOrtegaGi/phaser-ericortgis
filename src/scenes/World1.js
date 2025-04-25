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
    this.load.audio('walk', 'assets/sounds/walk.mp3');
  }

  create() {
    try {
      // Configurar mundo más grande
      this.physics.world.setBounds(0, 0, 2000, 600);

      // Agregar fondo
      this.add.image(1000, 300, 'background').setDisplaySize(2000, 600);

      // Habilitar físicas Arcade
      this.physics.world.gravity.y = 875;

      // Crear el jugador
      this.player = this.physics.add.sprite(100, 450, 'player', 0);
      this.player.body.setSize(64, 64);
      this.player.setCollideWorldBounds(true);

      // Hacer que la cámara siga al jugador
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setBounds(0, 0, 2000, 600);

      // Crear animación de caminar del jugador
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 1, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });

      // Crear grupo de enemigos
      this.enemies = this.physics.add.group();

      // Enemigo 1
      const enemy1 = this.enemies.create(500, 450, null);
      enemy1.setTint(0xff0000);
      enemy1.setDisplaySize(64, 64);
      enemy1.body.setSize(40, 40);
      enemy1.setCollideWorldBounds(true);
      enemy1.setVelocityX(100);
      enemy1.direction = 1;
      enemy1.isAggro = false;
      enemy1.patrolBounds = { minX: 400, maxX: 600 };

      // Enemigo 2
      const enemy2 = this.enemies.create(1850, 450, null);
      enemy2.setTint(0xff0000);
      enemy2.setDisplaySize(64, 64);
      enemy2.body.setSize(40, 40);
      enemy2.setCollideWorldBounds(true);
      enemy2.setVelocityX(100);
      enemy2.direction = 1;
      enemy2.isAggro = false;
      enemy2.patrolBounds = { minX: 1800, maxX: 1900 };

      // Configurar audio de pasos
      this.walkSound = this.sound.add('walk', {
        loop: true,
        volume: 0.5,
      });

      // Crear el suelo (transparente)
      const ground = this.physics.add.staticGroup();
      const groundSprite = ground.create(1000, 590, null).setDisplaySize(2000, 10).refreshBody();
      groundSprite.setAlpha(0);

      // Crear plataformas para parkour (transparente)
      const platforms = this.physics.add.staticGroup();
      platforms.create(700, 450, null).setDisplaySize(100, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(850, 350, null).setDisplaySize(100, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(1000, 250, null).setDisplaySize(100, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);
      platforms.create(1150, 150, null).setDisplaySize(100, 10).refreshBody().setTint(0x00ff00).setAlpha(0.7);

      // Colisiones
      this.physics.add.collider(this.player, ground);
      this.physics.add.collider(this.player, platforms);
      this.physics.add.collider(this.enemies, ground);
      this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);

      // Configurar teclas
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        usePotion: Phaser.Input.Keyboard.KeyCodes.Q, // Tecla Q para usar poción
      });

      // Sistema de vidas
      this.lives = 3;
      this.maxLives = 3;
      this.volatileLife = 0; // Vida volátil (0 o 1)
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

      // Mostrar vidas gráficamente (círculos blancos para vidas normales, círculo rojo para volátil)
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

      // Inventario
      this.inventory = { potion: 0 }; // Para almacenar pociones
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

      // Crear grupo de objetos recolectables (placeholder: círculos amarillos)
      this.collectibles = this.physics.add.group();
      this.collectibles.create(200, 450, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(800, 400, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(1400, 450, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(700, 350, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(850, 250, null).setDisplaySize(20, 20).setTint(0xffff00);
      this.collectibles.create(1000, 150, null).setDisplaySize(20, 20).setTint(0xffff00);

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

      // Crear cofre en la plataforma final (placeholder: rectángulo marrón)
      this.chest = this.physics.add.sprite(1150, 50, null);
      this.chest.setTint(0x8B4513);
      this.chest.setDisplaySize(40, 40);
      this.chest.body.setAllowGravity(false);
      this.chest.isOpened = false;

      // Colisión con el cofre
      this.physics.add.overlap(this.player, this.chest, this.openChest, null, this);

      // Crear portal (placeholder: círculo azul)
      this.portal = this.physics.add.sprite(1950, 450, null);
      this.portal.setTint(0x0000ff);
      this.portal.setDisplaySize(50, 50);
      this.portal.body.setAllowGravity(false);

      // Añadir efecto de parpadeo al portal
      this.tweens.add({
        targets: this.portal,
        alpha: 0.5,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });

      // Colisión con el portal
      this.physics.add.overlap(this.player, this.portal, this.handlePortal, null, this);

      // Inicializar bandera de movimiento y estado
      this.isMoving = false;
      this.isPlayerInvulnerable = false;
    } catch (error) {
      console.error('Error en create():', error);
    }
  }

  collectObject(player, collectible) {
    collectible.destroy();
    this.score += 10;
    this.scoreText.setText(`Puntuación: ${this.score}`);
  }

  openChest(player, chest) {
    if (chest.isOpened) return;

    chest.isOpened = true;
    chest.destroy();

    // Mostrar poción (placeholder: círculo verde)
    const potion = this.add.circle(1150, 50, 10, 0x00ff00).setDepth(1);
    this.tweens.add({
      targets: potion,
      y: 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => potion.destroy(),
    });

    // Mostrar estrella (placeholder: círculo blanco con borde negro)
    const star = this.add.circle(1150, 50, 10, 0xffffff).setStrokeStyle(2, 0x000000).setDepth(1);
    this.tweens.add({
      targets: star,
      y: 70,
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
      // Guardar la poción en el inventario
      this.inventory.potion += 1;
      this.inventoryText.setText(`Poción: ${this.inventory.potion} [Q para usar]`);
    }

    // Manejar la estrella
    if (this.lives < this.maxLives) {
      // Si tiene menos de 3 vidas, la estrella cura 1 vida normal
      this.lives += 1;
      if (this.lives > this.maxLives) this.lives = this.maxLives; // No exceder el máximo
      this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
      if (this.livesIcons.length < this.lives) {
        const lifeIcon = this.add.circle(80 + (this.lives - 1) * 40, 40, 10, 0xffffff).setScrollFactor(0);
        this.livesIcons.push(lifeIcon);
      }
    } else if (this.volatileLife === 0) {
      // Si tiene 3 vidas, la estrella otorga 1 vida volátil
      this.volatileLife = 1;
      this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
      const volatileIcon = this.add.circle(80 + this.lives * 40, 40, 10, 0xff0000).setScrollFactor(0); // Círculo rojo para vida volátil
      this.livesIcons.push(volatileIcon);
    }

    // Bonus de puntuación por la estrella
    this.score += 50;
    this.scoreText.setText(`Puntuación: ${this.score}`);
  }

  handlePlayerEnemyCollision(player, enemy) {
    try {
      if (player.body.velocity.y > 0 && player.y < enemy.y) {
        enemy.destroy();
        player.setVelocityY(-300);
      } else if (!this.isPlayerInvulnerable) {
        // Priorizar pérdida de vida volátil
        if (this.volatileLife > 0) {
          this.volatileLife = 0;
          this.livesText.setText(`Vidas: ${this.lives}${this.volatileLife ? ' + 1 volátil' : ''}`);
          this.livesIcons[this.livesIcons.length - 1].destroy(); // Eliminar el círculo volátil (rojo)
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

  handlePortal(player, portal) {
    // Efecto visual al tocar el portal
    this.cameras.main.flash(500, 255, 255, 255);
    
    // Guardar datos del jugador
    this.game.registry.set('playerData', {
      lives: this.lives,
      volatileLife: this.volatileLife,
      inventory: this.inventory,
      score: this.score
    });
    
    // Cambiar a la escena World2
    this.scene.start('World2');
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
}