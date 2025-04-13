<template>
  <div id="game-container"></div>
</template>

<script>
import Phaser from 'phaser';
import MainMenu from '../scenes/MainMenu';
import World1 from '../scenes/World1';

export default {
  name: 'Game',
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
          debug: false,
        },
      },
      scene: [MainMenu, World1],
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