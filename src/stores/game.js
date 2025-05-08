import { defineStore } from 'pinia'

// Tipos para el estado del juego
const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
}

// Interfaz para el estado del juego
const initialState = {
  score: 0,
  time: 0,
  currentWorld: 1,
  playerLives: 3,
  gameState: GameState.MENU,
  highScores: []
}

export const useGameStore = defineStore('game', {
  state: () => initialState,

  getters: {
    isGameOver: (state) => state.gameState === GameState.GAME_OVER,
    isPlaying: (state) => state.gameState === GameState.PLAYING,
    isPaused: (state) => state.gameState === GameState.PAUSED,
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
      this.gameState = GameState.PLAYING
      this.currentWorld = 1
    },

    pauseGame() {
      if (this.gameState === GameState.PLAYING) {
        this.gameState = GameState.PAUSED
      }
    },

    resumeGame() {
      if (this.gameState === GameState.PAUSED) {
        this.gameState = GameState.PLAYING
      }
    },

    gameOver() {
      this.gameState = GameState.GAME_OVER
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
      const newScore = {
        score: this.score,
        time: this.time,
        date: new Date().toISOString()
      }
      
      this.highScores.push(newScore)
      this.highScores.sort((a, b) => b.score - a.score)
      this.highScores = this.highScores.slice(0, 10)
    },

    changeWorld(worldNumber) {
      this.currentWorld = worldNumber
    }
  }
}) 