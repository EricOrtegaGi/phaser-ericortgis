import Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    // Fondo negro
    this.cameras.main.setBackgroundColor('#000000');

    // Título
    this.add.text(
      this.cameras.main.centerX,
      100,
      '',
      { fontSize: '64px', color: '#ffffff' }
    ).setOrigin(0.5);

    // Botón Start
    const startButton = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      200,
      50,
      0x00ff00
    ).setInteractive();

    this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Start',
      { fontSize: '32px', color: '#000000' }
    ).setOrigin(0.5);

    startButton.on('pointerdown', () => {
      this.scene.start('World1');
    });

    // Botón de sonido
    const soundButton = this.add.circle(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 100,
      25,
      0xffff00
    ).setInteractive();

    const soundText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 100,
      '♪',
      { fontSize: '24px', color: '#000000' }
    ).setOrigin(0.5);

    let isSoundOn = true;
    soundButton.on('pointerdown', () => {
      isSoundOn = !isSoundOn;
      this.sound.mute = !isSoundOn;
      soundText.setText(isSoundOn ? '♪' : 'X');
    });
  }
}