import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    score: 0,
    time: 0,
    currentWorld: 1,
    playerLives: 3,
    gameState: 'menu', // menu, playing, paused, gameOver
    highScores: []
  }),

  getters: {
    isGameOver: (state) => state.gameState === 'gameOver',
    isPlaying: (state) => state.gameState === 'playing',
    isPaused: (state) => state.gameState === 'paused',
    formattedTime: (state) => {
      const minutes = Math.floor(state.time / 60)
      const seconds = state.time % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  },

  actions: {
    startGame() {
      this.score = 0
      this.time = 0
      this.playerLives = 3
      this.gameState = 'playing'
    },

    pauseGame() {
      this.gameState = 'paused'
    },

    resumeGame() {
      this.gameState = 'playing'
    },

    gameOver() {
      this.gameState = 'gameOver'
      this.saveHighScore()
    },

    incrementScore(points) {
      this.score += points
    },

    decrementLives() {
      this.playerLives--
      if (this.playerLives <= 0) {
        this.gameOver()
      }
    },

    updateTime(seconds) {
      this.time = seconds
    },

    saveHighScore() {
      this.highScores.push({
        score: this.score,
        time: this.time,
        date: new Date().toISOString()
      })
      // Ordenar por puntuación descendente y mantener solo los 10 mejores
      this.highScores.sort((a, b) => b.score - a.score)
      this.highScores = this.highScores.slice(0, 10)
    },

    changeWorld(worldNumber) {
      this.currentWorld = worldNumber
    }
  }
}) 