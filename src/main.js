import { Scene1 } from "./scenes/game.js";


let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:200 }
        }
    },
    scene: [Scene1]
});