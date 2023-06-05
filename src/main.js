let config ={
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale:{
        mode:Phaser.Scale.FIT,
        autoCenter:Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:2000 },
        }
    },
    scene: [Intro, Scene1, Scene2, Scene4, Scene5]
};

let game = new Phaser.Game(config);