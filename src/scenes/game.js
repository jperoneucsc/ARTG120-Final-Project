// TEST SCENE FOR PROTOTYPING MOVEMENT

class Scene1 extends Phaser.Scene {
    constructor()
    {
        super('Scene1');
    }

    preload()
    {
        // Load panda sprite sheet
        this.load.atlas('LightBear', 'src/assets/LightBear.png', 'src/assets/LightBear.json');

        // Load background
        this.load.image("sky", "src/assets/YinSky.png")
        this.load.image("background", "src/assets/YinMountainFull.png");
        this.load.image("background2", "src/assets/YinMountainForeground.png");
        this.load.image("background3", "src/assets/YinMountainForeground2.png");

        // Load ground
        this.load.image("ground", "src/assets/forestFloor.png");

        // load nextscene temp asset
        this.load.image("nextScene", "src/assets/nextScene.png");
        // load next s


    }

    create()
    {
        console.log("Scene1 Starting");
        // Create animations ------------------------------------------------
        this.anims.create({
            key: 'player-idle',
            frameRate: 2,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 1,
                end: 7,
                prefix: 'LightBearIdle-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'player-walk',
            frameRate: 7,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 2,
                end: 6,
                prefix: 'LightBearWalk-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'player-run',
            frameRate: 8,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 1,
                end: 2,
                prefix: 'LightBearRun-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'player-jump',
            frameRate: 5,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 1,
                end: 2,
                prefix: 'LightBearJump-0',
                suffix: '.png'
            }),
            repeat: 0
        })
        this.anims.create({
            key: 'player-inair',
            frameRate: 6,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 2,
                end: 2,
                prefix: 'LightBearJump-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'player-strike',
            frameRate: 6,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 1,
                end: 2,
                prefix: 'LightBearStrike-0',
                suffix: '.png'
            }),
            repeat: -1
        })

        // Get the screen width + height
        const width = this.scale.width;
        const height = this.scale.height;

        const sceneWidth = 1920;
        const sceneHeight = 1080;


        // ------------------------ Instantiate sprites + background + foreground -------------------------

        // get background
        let background1 = this.add.image(500, 470, 'background').setScrollFactor(0.02);
        let sky = this.add.image(800, 400, "sky").setScrollFactor(0).setScale(.7);
        // get foreground mountains
        let background3 = this.add.image(-100, 25, 'background3').setOrigin(0,0).setScrollFactor(0.03);
        let background2 = this.add.image(0, 100, 'background2').setOrigin(0,0).setScrollFactor(0.04);

        // Create platforms to walk on
        const platforms = this.physics.add.staticGroup();
        platforms.create(width*.5, sceneHeight, "ground").setScale(1).setSize(1280,40);   // first floor
        platforms.create(width, sceneHeight, "ground").setScale(1).setSize(1280,40); 
        platforms.create(250, sceneHeight*.5, "ground").setScale(1).setSize(1280,40);
        platforms.create(1800, sceneHeight*.58, "ground").setScale(1).setSize(1280,40);
        platforms.create(1400, sceneHeight*.76, "ground").setScale(1).setSize(1280,40);

        // Add scene changer in the bottom right corner
        this.nextScene = this.physics.add.sprite(100, 450, 'nextScene').setSize(20,20);
        this.nextScene.body.setAllowGravity(false);
        
        // Create Bear
        this.player = this.physics.add.sprite(width * 0.52, height * 0.5, 'LightBear').setScale(0.27).setSize(200,490).play('player-idle');

        // Add camera movement
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);

        // Set camera and world bounds
        this.camera.setBounds(0,0, sceneWidth, sceneHeight);
        this.physics.world.setBounds(0,0, sceneWidth, sceneHeight);

        // Add collider between bear and platforms and world bounds
        this.physics.add.collider(this.player, platforms);
        this.player.setCollideWorldBounds(true);

        // player collision go to next scene
        this.physics.add.collider(this.player, this.nextScene, () => {
            console.log("Collision. this.scene.start(Scene2);");
            this.scene.start("Scene2");
        });
    }
    
    update()
    {  
        // -------------------------------- PLAYER MOVEMENT ---------------------------------------
        const cursors = this.input.keyboard.createCursorKeys();
        const keys = this.input.keyboard.addKeys("W,A,S,D,E,SPACE");

        // Check is player is able to jump
        if((!cursors.up.isDown || !keys.W.isDown || !keys.SPACE.isDown) && this.player.body.touching.down){
            this.player.allowedToDoubleJump = false;
        }


        // Check if player is trying to strike
        if(Phaser.Input.Keyboard.JustDown(keys.E)){
            // currently animations will interfere with eachother and not play properly
            // until this is fixed the strike animation will not work
            this.player.anims.play("player-strike");
            // this.scene.start("Scene2"); // for scene debugging pressing e will switch scenes
            // Insert code for breaking walls and stuff here
        }

        // Check if player is pressing left or right, with shift or not
        if (cursors.left.isDown || keys.A.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.scaleX >= 0){
                    this.player.flipX = true;
                }
                this.player.setVelocityX(-270);
                if(this.player.body.touching.down){this.player.anims.play("player-run", true);}
            }else{      // player is walking
                if(this.player.scaleX >= 0){
                    this.player.flipX = true;
                }
                this.player.setVelocityX(-160);
                if(this.player.body.touching.down){this.player.anims.play("player-walk", true);}
            }
            
        }else if (cursors.right.isDown || keys.D.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.flipX == true){
                    this.player.flipX = false;
                }
                this.player.setVelocityX(270);
                if(this.player.body.touching.down){this.player.anims.play("player-run", true);}
            }else{      // player is walking
                if(this.player.flipX == true){
                    this.player.flipX = false;
                }
                this.player.setVelocityX(160);
                if(this.player.body.touching.down){this.player.anims.play("player-walk", true);}
            }
        }else{      // no key is being pressed
            this.player.setVelocityX(0);
            if(this.player.body.velocity.y > 100){
                this.player.anims.play('player-inair');
            }
            this.player.anims.play("player-idle", true);
        }

        // Check if player is trying to jump
        if(Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(keys.W) || Phaser.Input.Keyboard.JustDown(keys.SPACE)){
            if(this.player.body.touching.down){
                this.player.setVelocityY(-700);
                this.player.anims.play("player-jump");
                this.player.allowedToDoubleJump = true;
            }
            else {
                if(this.player.allowedToDoubleJump == true){
                    this.player.allowedToDoubleJump = false;
                    this.player.setVelocityY(-800);
                }
            }
        }
    }
}
    