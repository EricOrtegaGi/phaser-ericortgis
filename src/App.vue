<template>
  <div id="app">
    <h1></h1>
    <MyGame />
  </div>
</template>

<script>
import MyGame from './components/MyGame.vue';

export default {
  name: 'App',
  components: {
    MyGame,
  },
};
</script>

<style>
#app {
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>