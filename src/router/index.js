import { createRouter, createWebHistory } from 'vue-router'
import Game from '../components/Game.vue'
import MainMenu from '../components/MainMenu.vue'
import StartMenu from '../components/StartMenu.vue'
import ResultScreen from '../components/ResultScreen.vue'
import SettingsMenu from '../components/SettingsMenu.vue'

const routes = [
  {
    path: '/',
    name: 'StartMenu',
    component: StartMenu
  },
  {
    path: '/main',
    name: 'MainMenu',
    component: MainMenu
  },
  {
    path: '/settings',
    name: 'SettingsMenu',
    component: SettingsMenu
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/results',
    name: 'ResultScreen',
    component: ResultScreen
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 