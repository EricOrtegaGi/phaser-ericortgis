<template>
  <div class="main-menu slide-in-top">
    <h1 class="fade-in">¿?</h1>
    <div class="menu-buttons">
      <button @click="startGame" class="main-button start hover-scale hover-glow">Nueva Partida</button>
      <button @click="showLoadGames" class="main-button load hover-scale hover-glow">Cargar Partida</button>
    </div>
    <div v-if="showSavedGames" class="saved-games fade-in">
      <h2>Partidas Guardadas</h2>
      <ul>
        <li v-for="(game, index) in savedGames" :key="index" class="saved-game-item">
          {{ formatSavedGame(game) }}
          <button @click="loadGame(index)" class="mini-btn">Cargar</button>
          <button @click="deleteGame(index)" class="mini-btn delete">Eliminar</button>
        </li>
      </ul>
      <button @click="showSavedGames = false" class="mini-btn">Cerrar</button>
    </div>
    <div v-if="highScores.length > 0" class="high-scores fade-in">
      <h2>Mejores Puntuaciones</h2>
      <ul>
        <li v-for="(score, index) in highScores" :key="index" class="score-item">
          {{ score.score }} puntos - {{ formatDate(score.date) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useGameStore } from '../stores/game'
import { storeToRefs } from 'pinia'

export default {
  name: 'MainMenu',
  setup() {
    const gameStore = useGameStore()
    const { highScores, savedGames, settings } = storeToRefs(gameStore)
    return {
      gameStore,
      highScores,
      savedGames,
      settings
    }
  },
  data() {
    return {
      showSavedGames: false
    }
  },
  methods: {
    startGame() {
      this.gameStore.startGame()
      this.$router.push('/game')
    },
    showLoadGames() {
      this.showSavedGames = true
    },
    loadGame(index) {
      this.gameStore.loadGame(index)
      this.$router.push('/game')
    },
    deleteGame(index) {
      this.gameStore.deleteSavedGame(index)
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    formatSavedGame(game) {
      return `Puntos: ${game.score}, Mundo: ${game.currentWorld}, Vidas: ${game.playerLives}, ${this.formatDate(game.date)}`
    }
  }
}
</script>

<style scoped>
.main-menu {
  text-align: center;
  color: white;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  animation: slideInFromTop 0.5s ease-out;
  max-width: 500px;
  margin: 3rem auto;
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #00ffff;
  animation: fadeIn 1s ease-out;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.main-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #000;
}

.main-button.start {
  background-color: #00ff00;
  animation: buttonGlow 2s infinite;
}

.main-button.load {
  background-color: #0000ff;
  color: #fff;
  animation: buttonGlow 2s infinite;
}

.saved-games {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  animation: fadeIn 0.5s ease-out;
}

.saved-games h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #00ffff;
}

.saved-games ul {
  list-style: none;
  padding: 0;
}

.saved-game-item {
  margin: 0.5rem 0;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.mini-btn {
  padding: 0.2rem 0.7rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  margin-left: 0.3rem;
  cursor: pointer;
  background: #00ffff;
  color: #000;
  transition: background 0.2s;
}
.mini-btn.delete {
  background: #ff0055;
  color: #fff;
}
.mini-btn:hover {
  background: #00ff00;
}

.high-scores {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  animation: fadeIn 0.5s ease-out;
}

.high-scores h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #00ffff;
}

.high-scores ul {
  list-style: none;
  padding: 0;
}

.score-item {
  margin: 0.5rem 0;
  color: #fff;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: both;
}
.score-item:hover {
  transform: scale(1.05);
  color: #00ffff;
}
.score-item:nth-child(1) { animation-delay: 0.1s; }
.score-item:nth-child(2) { animation-delay: 0.2s; }
.score-item:nth-child(3) { animation-delay: 0.3s; }
.score-item:nth-child(4) { animation-delay: 0.4s; }
.score-item:nth-child(5) { animation-delay: 0.5s; }
</style> 