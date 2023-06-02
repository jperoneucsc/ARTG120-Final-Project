let config ={
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:2000 },
            //debug: true,
        }
    },
    scene: [Scene1, Scene2]
};

let game = new Phaser.Game(config);