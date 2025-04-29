import Phaser from 'phaser'
import { useGameStore } from '../../stores/game'

export class BaseScene extends Phaser.Scene {
  constructor(config) {
    super(config)
    this.store = useGameStore()
  }

  init(data) {
    this.gameData = data
    console.log(`Iniciando escena: ${this.scene.key}`)
  }

  preload() {
    // Mostrar barra de carga
    this.createLoadingBar()
  }

  create() {
    // Configuración común para todas las escenas
    this.setupCommonElements()
  }

  createLoadingBar() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50)

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Cargando...', {
      font: '20px Arial',
      fill: '#ffffff'
    })
    loadingText.setOrigin(0.5, 0.5)

    this.load.on('progress', (value) => {
      progressBar.clear()
      progressBar.fillStyle(0x00ff00, 1)
      progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
    })
  }

  setupCommonElements() {
    // Configurar teclas comunes
    this.setupKeyboardControls()

    // Configurar eventos de pausa
    this.setupPauseEvents()
  }

  setupKeyboardControls() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      esc: Phaser.Input.Keyboard.KeyCodes.ESC
    })

    // Configurar evento de pausa con ESC
    this.keys.esc.on('down', () => {
      this.togglePause()
    })
  }

  setupPauseEvents() {
    this.events.on('pause', () => {
      this.store.pauseGame()
    })

    this.events.on('resume', () => {
      this.store.resumeGame()
    })
  }

  togglePause() {
    if (this.scene.isPaused()) {
      this.scene.resume()
    } else {
      this.scene.pause()
    }
  }

  updateScore(points) {
    this.store.incrementScore(points)
  }

  gameOver() {
    this.store.gameOver()
    this.scene.start('ResultScreen')
  }
} 