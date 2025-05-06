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
  highScores: [],
  savedGames: [],
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'normal'
  }
}

// Función para cargar el estado inicial desde localStorage
const loadInitialState = () => {
  const savedState = localStorage.getItem('gameState')
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState)
      return {
        ...initialState,
        ...parsed,
        gameState: GameState.MENU // Siempre empezamos en el menú
      }
    } catch (error) {
      console.error('Error loading saved state:', error)
      return initialState
    }
  }
  return initialState
}

export const useGameStore = defineStore('game', {
  state: () => loadInitialState(),

  getters: {
    isGameOver: (state) => state.gameState === GameState.GAME_OVER,
    isPlaying: (state) => state.gameState === GameState.PLAYING,
    isPaused: (state) => state.gameState === GameState.PAUSED,
    formattedTime: (state) => {
      const minutes = Math.floor(state.time / 60)
      const seconds = state.time % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },
    sortedSavedGames: (state) => {
      return [...state.savedGames].sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },

  actions: {
    // Guardar el estado actual en localStorage
    saveState() {
      const stateToSave = {
        highScores: this.highScores,
        savedGames: this.savedGames,
        settings: this.settings
      }
      localStorage.setItem('gameState', JSON.stringify(stateToSave))
    },

    startGame() {
      this.score = 0
      this.time = 0
      this.playerLives = 3
      this.gameState = GameState.PLAYING
      this.saveState()
    },

    pauseGame() {
      this.gameState = GameState.PAUSED
      this.saveState()
    },

    resumeGame() {
      this.gameState = GameState.PLAYING
    },

    gameOver() {
      this.gameState = GameState.GAME_OVER
      this.saveHighScore()
      this.saveState()
    },

    incrementScore(points) {
      this.score += points
      this.saveState()
    },

    decrementLives() {
      this.playerLives--
      if (this.playerLives <= 0) {
        this.gameOver()
      }
      this.saveState()
    },

    updateTime(seconds) {
      this.time = seconds
      this.saveState()
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
      this.saveState()
    },

    changeWorld(worldNumber) {
      this.currentWorld = worldNumber
      this.saveState()
    },

    saveGame(playerData) {
      const gameState = {
        score: this.score,
        time: this.time,
        currentWorld: this.currentWorld,
        playerLives: this.playerLives,
        playerData: playerData,
        date: new Date().toISOString()
      }
      
      this.savedGames.push(gameState)
      if (this.savedGames.length > 5) {
        this.savedGames = this.savedGames.slice(-5)
      }
      
      this.saveState()
    },

    loadGame(index) {
      if (index >= 0 && index < this.savedGames.length) {
        const gameState = this.savedGames[index]
        this.score = gameState.score
        this.time = gameState.time
        this.currentWorld = gameState.currentWorld
        this.playerLives = gameState.playerLives
        this.gameState = GameState.PLAYING
        this.saveState()
        return gameState.playerData
      }
      return null
    },

    deleteSavedGame(index) {
      if (index >= 0 && index < this.savedGames.length) {
        this.savedGames.splice(index, 1)
        this.saveState()
      }
    },

    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      this.saveState()
    }
  }
}) 