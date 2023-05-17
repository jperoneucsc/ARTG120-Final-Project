export class Scene1 extends Phaser.Scene {
    constructor()
    {
        super('scene1');
    }

    preload()
    {
        // Load panda sprite sheet
        this.load.atlas('panda1', 'assets/panda.png', 'assets/panda.json');
    }

    create()
    {
        // get the screen width + height
        const width = this.scale.width;
        const height = this.scale.height;

        // Create Panda
        // this.add.image(width * 0.5, height * 0.5, 'panda1', "panda_01_run_02.png");
    }

}

    