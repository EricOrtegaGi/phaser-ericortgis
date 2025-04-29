<template>
  <div class="game-wrapper">
    <div id="game-container"></div>
    <div v-if="isPaused" class="pause-overlay">
      <div class="pause-menu">
        <h2>Juego Pausado</h2>
        <button @click="resumeGame" class="btn btn-primary">Continuar</button>
        <button @click="exitGame" class="btn btn-secondary">Salir al Menú</button>
      </div>
    </div>
  </div>
</template>

<script>
import Phaser from 'phaser'
import { createGameConfig } from '../scenes/config/gameConfig'
import { useGameStore } from '../stores/game'
import { storeToRefs } from 'pinia'

export default {
  name: 'Game',
  setup() {
    const gameStore = useGameStore()
    const { isPaused } = storeToRefs(gameStore)
    return { isPaused }
  },
  data() {
    return {
      game: null
    }
  },
  methods: {
    initGame() {
      if (this.game) return
      
      const config = createGameConfig('game-container')
      this.game = new Phaser.Game(config)
    },
    destroyGame() {
      if (!this.game) return
      
      this.game.destroy(true)
      this.game = null
    },
    resumeGame() {
      const currentScene = this.game.scene.scenes.find(scene => scene.scene.isPaused())
      if (currentScene) {
        currentScene.scene.resume()
      }
    },
    exitGame() {
      this.destroyGame()
      this.$router.push('/')
    }
  },
  mounted() {
    this.initGame()
  },
  beforeUnmount() {
    this.destroyGame()
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
</style>