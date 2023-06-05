// Fifth Scene
// End cutscene/bear merge into panda

class Scene5 extends Phaser.Scene {
    constructor()
    {
        super('Scene5');
    }

    preload(){
        this.load.audio('endSceneMusic', 'src/assets/audio/InTheRainAtDusk.mp3');

        // Load ground
        this.load.image("ground", "src/assets/forestFloor.png");

        //load in the sprites for the animation cutscene
        this.load.atlas('Fusion', 'src/assets/pandaFusion.png', 'src/assets/pandaFusion.json');

        //load background
        this.load.image('forest', 'src/assets/forestBackground.png');
    }

    create(){
        this.music = this.sound.add('endSceneMusic', {volume: 0.2});
        this.music.loop = true;
        this.music.play();


        //create animation for the cutscene
        this.anims.create({
            key: 'cutscene',
            framerate: 4,
            frames: this.anims.generateFrameNames('Fusion', {
                start: 1,
                end: 10,
                prefix: 'FUSION-',
                suffix: '.png'
            }),
            repeat: 0
        })

        const width = this.scale.width;
        const height = this.scale.height;

        this.add.image(width/2, height/2, 'forest');
        let cut = this.add.sprite(width/2, height/1.3, 'Fusion').setScale(0.5).play('cutscene');
        cut.anims.msPerFrame = 300;

        let text = this.add.text(width*0.25, height*0.05, 'Click anywhere to play again', {fontSize: 40})

        this.input.once('pointerdown', () => {
            this.sounds.stopAll();
            this.scene.start('Intro');
        })

    }

}