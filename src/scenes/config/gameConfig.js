import Phaser from 'phaser'
import World1 from '../levels/World1'
import World2 from '../levels/World2'

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600

export const PHYSICS_CONFIG = {
  default: 'arcade',
  arcade: {
    gravity: { y: 0 },
    debug: process.env.NODE_ENV === 'development'
  }
}

export const SCENES = [World1, World2]

export const createGameConfig = (containerId) => ({
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: containerId,
  physics: PHYSICS_CONFIG,
  scene: SCENES,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#000000'
}) 