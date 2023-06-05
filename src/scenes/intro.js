// title screentweens movement phaser examplespha
// play
// level selector
// controls?

class Intro extends Phaser.Scene {
    constructor() {
        super('Intro')
    }

    preload(){
        this.load.image("background", "src/assets/YinMountainFull.png");
        this.load.image('playButton', "src/assets/playButton.png")
        this.load.image('playButtonText', "src/assets/playButton2.png")

        this.load.audio('endSceneMusic', 'src/assets/audio/InTheRainAtDusk.mp3');
    }

    create() {
        this.cameras.main.fadeIn(2000);

        this.music = this.sound.add('endSceneMusic', {volume: 0.2});
        this.music.play();
        let background = this.add.image(6,4.5, 'background').setInteractive();
        background.setOrigin(0,0).setScale(.66);

        var style = { font: "bold 92px Arial", fill: '0x000000', boundsAlignH: 'center', boundsAlignV: 'middle'};
        
        this.cameras.main.on('camerafadeincomplete', () => {
            let text1 = this.add.text(640, 720/4, "PANDAMONIUM", style);
            text1.setStroke('#FFFFFF', 16).setOrigin(.5,.5);
            text1.setShadow(2, 2, '#333333', 2, true, true);
            var tween1 = this.tweens.add({
                targets: text1,
                scale: {
                    from: 0,
                    to: 1,
                },
                ease: 'Linear',
                duration: 1000
            })
            tween1.on('complete', () => {
                this.playButton = this.add.image(640, 350, 'playButton').setOrigin(.5,.5).setInteractive();

                this.playButton2 = this.add.image(640, 350, 'playButtonText').setOrigin(.5,.5).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                    this.cameras.main.fadeOut(1000, 0, 0, 0);
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                        this.game.sound.stopAll();
                        this.scene.start("Scene1");
                    })
                })
                .on('pointerover', () => {
                    this.playButton2.setScale(0.8);
                })
                
                this.tweens.add({
                    targets: this.playButton,
                    scale: {
                        from: 0,
                        to: 1,
                    },
                    ease: 'Linear',
                    duration: 1000
                })
                this.tweens.add({
                    targets: this.playButton2,
                    scale: {
                        from: 0,
                        to: 1,
                    },
                    ease: 'Linear',
                    duration: 1000
                })
            });
            background.on('pointerover', () => {
                this.playButton2.setScale(1);
            });
        })

        console.log('intro starting');
    }
}