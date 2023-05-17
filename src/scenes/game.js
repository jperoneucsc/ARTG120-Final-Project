export class Scene1 extends Phaser.Scene {
    constructor()
    {
        super('scene1');
    }

    preload()
    {
        // Load panda sprite sheet
        this.load.atlas('panda1', 'assets/panda.png', 'assets/panda.json');

        //Load sky
        this.load.image("background", "assets/forestBackground.png");


    }

    create()
    {
        // get the screen width + height
        const width = this.scale.width;
        const height = this.scale.height;


        // get background
        let background1 = this.add.image(width * 0.5, height * 0.5, 'background');

        //const platforms = this.physics.add.staticGroup();
        //platforms.create(400,500, "ground").setScale(1).refreshBody();
        // load map


        // Create Panda
        let panda1 = this.add.image(width * 0.5, height * 0.5, 'panda1', "panda_01_run_02.png").setScale(0.5);

    }

}

    