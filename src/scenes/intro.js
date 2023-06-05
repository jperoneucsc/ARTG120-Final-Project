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
    }

    create() {
        this.cameras.main.fadeIn(2000);

        var style = { font: "bold 72px Arial", fill: '0x000000', boundsAlignH: 'center', boundsAlignV: 'middle'};
        
        this.cameras.main.on('camerafadeincomplete', () => {
            let text1 = this.add.text(400, 720/4, "PANDAMONIUM", style);
            text1.setStroke('#FFFFFF', 16);
            text1.setShadow(2, 2, '#333333', 2, true, true);
            let playButton = this.add.image(400, 720/2, 'playButton').setOrigin(0,0).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                console.log('pressed');
            })
            var tween1 = this.tweens.add({
                targets: text1,
                scale: {
                    from: 0,
                    to: 1,
                },
                ease: 'Linear',
                duration: 1000
            })
            var tween2 = this.tweens.add({
                targets: playButton,
                scale: {
                    from: 0,
                    to: 1,
                },
                ease: 'Linear',
                duration: 1000
            })
            tween1.chain(tween2);
        })

        let background = this.add.image(6,4.5, 'background');
        background.setOrigin(0,0).setScale(.66);
        console.log('intro starting');
    }
}