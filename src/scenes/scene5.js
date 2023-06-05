// Fifth Scene
// End cutscene/bear merge into panda

class Scene5 extends Phaser.Scene {
    constructor()
    {
        super('Scene5');
    }

    preload(){

        //load in the sprites for the animation cutscene
        this.load.atlas('Fusion', 'src/assets/pandaFusion.png', 'src/assets/pandaFusion.json');

        //load background
        this.load.image('forest', 'src/assets/forestBackground.png');
    }

    create(){
        console.log("Scene5 Starting");

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
        let cut = this.add.sprite(width/2, height/2, 'Fusion').play('cutscene');
        cut.anims.msPerFrame = 300;

        let text = this.add.text(width*0.25, height*0.05, 'Click anywhere to play again', {fontSize: 40})

        this.input.once('pointerdown', () => {
            this.scene.start('Intro');
        })

    }

}