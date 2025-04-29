import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    score: 0,
    time: 0,
    currentWorld: 1,
    playerLives: 3,
    gameState: 'menu', // menu, playing, paused, gameOver
    highScores: [],
    savedGames: [] // Array para almacenar múltiples partidas guardadas
  }),

  getters: {
    isGameOver: (state) => state.gameState === 'gameOver',
    isPlaying: (state) => state.gameState === 'playing',
    isPaused: (state) => state.gameState === 'paused',
    formattedTime: (state) => {
      const minutes = Math.floor(state.time / 60)
      const seconds = state.time % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    // Obtener las partidas guardadas ordenadas por fecha
    sortedSavedGames: (state) => {
      return [...state.savedGames].sort((a, b) => new Date(b.date) - new Date(a.date))
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
    },

    // Guardar el estado actual del juego
    saveGame(playerData) {
      const gameState = {
        score: this.score,
        time: this.time,
        currentWorld: this.currentWorld,
        playerLives: this.playerLives,
        playerData: playerData,
        date: new Date().toISOString()
      }
      
      // Agregar a las partidas guardadas
      this.savedGames.push(gameState)
      
      // Mantener solo las últimas 5 partidas guardadas
      if (this.savedGames.length > 5) {
        this.savedGames = this.savedGames.slice(-5)
      }
      
      // Guardar en localStorage
      localStorage.setItem('savedGames', JSON.stringify(this.savedGames))
    },

    // Cargar una partida guardada
    loadGame(index) {
      if (index >= 0 && index < this.savedGames.length) {
        const gameState = this.savedGames[index]
        this.score = gameState.score
        this.time = gameState.time
        this.currentWorld = gameState.currentWorld
        this.playerLives = gameState.playerLives
        return gameState.playerData
      }
      return null
    },

    // Eliminar una partida guardada
    deleteSavedGame(index) {
      if (index >= 0 && index < this.savedGames.length) {
        this.savedGames.splice(index, 1)
        localStorage.setItem('savedGames', JSON.stringify(this.savedGames))
      }
    },

    // Cargar las partidas guardadas desde localStorage
    loadSavedGames() {
      const savedGames = localStorage.getItem('savedGames')
      if (savedGames) {
        try {
          this.savedGames = JSON.parse(savedGames)
        } catch (error) {
          console.error('Error al cargar las partidas guardadas:', error)
          this.savedGames = []
        }
      }
    }
  }
}) 