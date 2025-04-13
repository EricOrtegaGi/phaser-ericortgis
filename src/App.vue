<template>
  <div>
    <Game />
  </div>
</template>

<script>
import Game from './components/Game.vue';

export default {
  name: 'App',
  components: {
    Game,
  },
};
</script>

<style>
/* Estilos opcionales */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>