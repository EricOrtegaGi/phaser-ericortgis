<template>
  <div class="settings-menu slide-in-top">
    <h1 class="fade-in">Ajustes</h1>
    <div class="settings-section">
      <h2>Volumen</h2>
      <label>
        General
        <input type="range" min="0" max="100" v-model="settings.volume" />
        {{ settings.volume }}%
      </label>
      <label>
        Música
        <input type="range" min="0" max="100" v-model="settings.music" />
        {{ settings.music }}%
      </label>
      <label>
        Efectos
        <input type="range" min="0" max="100" v-model="settings.effects" />
        {{ settings.effects }}%
      </label>
    </div>
    <button class="main-button" @click="saveAndBack">Guardar y Volver</button>
  </div>
</template>

<script>
export default {
  name: 'SettingsMenu',
  data() {
    return {
      settings: {
        volume: 80,
        music: 70,
        effects: 80
      }
    }
  },
  methods: {
    saveAndBack() {
      // Aquí puedes guardar los ajustes en el store o localStorage
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.settings-menu {
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
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px #00ffff;
  animation: fadeIn 1s ease-out;
}

.settings-section {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin: 1rem 0;
  font-size: 1.1rem;
}

input[type="range"] {
  width: 200px;
  margin-left: 1rem;
}

.main-button {
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  background: #00ff00;
  color: #000;
  cursor: pointer;
  animation: buttonGlow 2s infinite;
}
</style> 