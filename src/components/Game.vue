<template>
  <div id="game-container"></div>
</template>

<script>
import Phaser from 'phaser';
import MainMenu from '../scenes/MainMenu';
import World1 from '../scenes/World1';
import World2 from '../scenes/World2';

export default {
  name: 'Game',
  data() {
    return {
      game: null,
    };
  },
  mounted() {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false, // Habilitar depuración
        },
      },
      scene: [MainMenu, World1, World2],
    };

    new Phaser.Game(config);
  },
};
</script>

<style scoped>
#game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>