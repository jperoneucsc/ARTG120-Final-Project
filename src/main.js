import { Scene1 } from "./scenes/game.js";


let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:1000 }
        }
    },
    scene: [Scene1]
});