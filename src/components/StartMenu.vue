<template>
  <div class="start-menu">
    <h1>¿?</h1>
    <div class="menu-buttons">
      <button @click="startGame" class="start-button">Iniciar Juego</button>
      <button @click="showInstructions" class="instructions-button">Instrucciones</button>
    </div>
    <div v-if="highScores.length > 0" class="high-scores">
      <h2>Mejores Puntuaciones</h2>
      <ul>
        <li v-for="(score, index) in highScores" :key="index">
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
  name: 'StartMenu',
  setup() {
    const gameStore = useGameStore()
    const { highScores } = storeToRefs(gameStore)

    return {
      highScores,
      gameStore
    }
  },
  methods: {
    startGame() {
      this.gameStore.startGame()
      this.$router.push('/game')
    },
    showInstructions() {
      alert('Instrucciones del juego:\n1. Usa las flechas para moverte\n2. Recolecta todos los objetos\n3. Evita los obstáculos')
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.start-menu {
  text-align: center;
  color: white;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #00ffff;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
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
  box-shadow: 0 0 15px #00ffff;
}

.start-button {
  background-color: #00ff00;
}

.instructions-button {
  background-color: #ffff00;
}

.high-scores {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
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

.high-scores li {
  margin: 0.5rem 0;
  color: #fff;
}
</style>
