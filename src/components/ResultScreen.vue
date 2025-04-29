<template>
  <div class="result-screen">
    <h1>Resultados</h1>
    <div class="score-display">
      <p>Puntuación: {{ score }}</p>
      <p>Tiempo: {{ formattedTime }}</p>
      <p>Vidas restantes: {{ playerLives }}</p>
    </div>
    <div class="result-buttons">
      <button @click="playAgain" class="play-again-button">Jugar de nuevo</button>
      <button @click="goToMenu" class="menu-button">Menú principal</button>
    </div>
  </div>
</template>

<script>
import { useGameStore } from '../stores/game'
import { storeToRefs } from 'pinia'

export default {
  name: 'ResultScreen',
  setup() {
    const gameStore = useGameStore()
    const { score, time, playerLives, formattedTime } = storeToRefs(gameStore)

    return {
      score,
      time,
      playerLives,
      formattedTime,
      gameStore
    }
  },
  methods: {
    playAgain() {
      this.gameStore.startGame()
      this.$router.push('/game')
    },
    goToMenu() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.result-screen {
  text-align: center;
  color: white;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #ff00ff;
}

.score-display {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.score-display p {
  margin: 1rem 0;
}

.result-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #000;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #ff00ff;
}

.play-again-button {
  background-color: #00ff00;
}

.menu-button {
  background-color: #ff00ff;
}
</style>
