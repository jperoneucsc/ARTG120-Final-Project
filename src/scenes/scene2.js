// Second Scene
// Dark Bear tutorial level

class Scene2 extends Phaser.Scene {
    constructor()
    {
        super('scene2');
    }

    preload()
    {
        // Load panda sprite sheet
        this.load.atlas('LightBear', 'src/assets/LightBear.png', 'src/assets/LightBear.json');

        // Load background
        this.load.image("background", "src/assets/YinMountainFull.png");

        // Load ground
        this.load.image("ground", "src/assets/forestFloor.png")
    }

    create()
    {
    }
}