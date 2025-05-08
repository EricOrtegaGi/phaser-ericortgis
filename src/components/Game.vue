<template>
  <div class="game-wrapper">
    <div id="game-container"></div>
    <div v-if="showPause" class="pause-overlay">
      <div class="pause-menu">
        <h2>Juego Pausado</h2>
        <button @click="resumeGame" class="btn btn-primary">Continuar</button>
        <button @click="toggleMute" class="btn btn-secondary">
          <span v-if="isMuted">Activar Sonido</span>
          <span v-else>Mutear</span>
        </button>
        <button @click="exitGame" class="btn btn-secondary">Salir al Menú</button>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-bar">
        <div class="loading-progress" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <p>Cargando...</p>
    </div>
  </div>
</template>

<script>
import Phaser from 'phaser'
import { createGameConfig } from '../scenes/config/gameConfig'
import { useGameStore } from '../stores/game'

export default {
  name: 'Game',
  setup() {
    const gameStore = useGameStore()
    return { gameStore }
  },
  data() {
    return {
      game: null,
      loadingProgress: 0,
      isLoading: true,
      preloadComplete: false,
      showPause: false,
      isMuted: false
    }
  },
  methods: {
    async initGame() {
      if (this.game) return
      try {
        this.isLoading = true
        this.loadingProgress = 0
        const config = createGameConfig('game-container')
        config.callbacks = {
          preBoot: () => { this.loadingProgress = 20 },
          postBoot: () => { this.loadingProgress = 40 }
        }
        this.game = new Phaser.Game(config)
        await new Promise(resolve => {
          this.game.events.once('ready', () => {
            this.loadingProgress = 100
            this.isLoading = false
            this.preloadComplete = true
            this.gameStore.startGame()
            resolve()
          })
        })
        this.applyMute()
      } catch (error) {
        console.error('Error initializing game:', error)
        this.isLoading = false
        this.destroyGame()
      }
    },
    destroyGame() {
      if (!this.game) return
      this.game.events.removeAllListeners()
      this.game.scene.scenes.forEach(scene => {
        if (scene.scene.isActive()) scene.scene.stop()
        scene.scene.remove()
      })
      this.game.destroy(true)
      this.game = null
      const container = document.getElementById('game-container')
      if (container) container.innerHTML = ''
      this.preloadComplete = false
      this.loadingProgress = 0
      this.gameStore.pauseGame()
    },
    resumeGame() {
      if (!this.game) return
      this.showPause = false
      const currentScene = this.game.scene.scenes.find(scene => scene.scene.isPaused())
      if (currentScene) currentScene.scene.resume()
    },
    toggleMute() {
      this.isMuted = !this.isMuted
      this.applyMute()
    },
    applyMute() {
      if (this.game && this.game.sound) {
        this.game.sound.mute = this.isMuted
      }
    },
    exitGame() {
      this.destroyGame()
      this.$router.push('/')
    },
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.showPause = !this.showPause
        if (this.showPause && this.game) {
          const currentScene = this.game.scene.scenes.find(scene => scene.scene.isActive())
          if (currentScene) {
            currentScene.scene.pause()
            if (this.game.sound) {
              this.game.sound.stopAll()
            }
          }
        } else if (!this.showPause) {
          this.resumeGame()
        }
      }
    }
  },
  mounted() {
    this.initGame()
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeUnmount() {
    this.destroyGame()
    window.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>

<style scoped>
.game-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

#game-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pause-menu {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.pause-menu h2 {
  color: white;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  text-shadow: 0 0 10px #00ffff;
}

.pause-menu button {
  display: block;
  width: 200px;
  margin: 1rem auto;
  padding: 0.8rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pause-menu button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #00ffff;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.loading-bar {
  width: 80%;
  max-width: 400px;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}

.loading-progress {
  height: 100%;
  background-color: #00ff00;
  transition: width 0.3s ease;
}
</style>