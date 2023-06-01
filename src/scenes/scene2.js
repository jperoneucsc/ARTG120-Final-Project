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
        this.load.image("background", "src/assets/YangMountainFull.png");

        // Load ground
        this.load.image("ground", "src/assets/forestFloor.png")
    }

    create()
    {
        // Get the screen width + height
        const width = this.scale.width;
        const height = this.scale.height;

        const sceneWidth = 1920;
        const sceneHeight = 1080;


        // ------------------------ Instantiate sprites + background + foreground -------------------------

        // get background
        let background1 = this.add.image(sceneWidth*.5, sceneHeight*.5, 'background');




        // Create platforms to walk on
        const platforms = this.physics.add.staticGroup();
        platforms.create(width*.5, sceneHeight, "ground").setScale(1).setSize(1280,40);   // first floor
        platforms.create(width, sceneHeight, "ground").setScale(1).setSize(1280,40); 
        platforms.create(100, sceneHeight*.5, "ground").setScale(1).setSize(1280,40);
        platforms.create(100, sceneHeight*.75, "ground").setScale(1).setSize(1280,40);


        // Create Bear
        this.player = this.physics.add.sprite(width * 0.5, height * 0.5, 'LightBear').setScale(0.27).setSize(200,490).play('player-idle');

        // Add camera movement
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);

        // Set camera and world bounds
        this.camera.setBounds(0,0, sceneWidth, sceneHeight);
        this.physics.world.setBounds(0,0, sceneWidth, sceneHeight);

        // Add collider between bear and platforms and world bounds
        this.physics.add.collider(this.player, platforms);
        this.player.setCollideWorldBounds(true);

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


        if(Phaser.Input.Keyboard.JustDown(keys.E)){
            // currently animations will interfere with eachother and not play properly
            // until this is fixed the strike animation will not work
            this.player.anims.play("player-strike");
            //this.game.scene.start('scene1');
            // Insert code for breaking walls and stuff here
        }

        // Check if player is pressing left or right, with shift or not
        if (cursors.left.isDown || keys.A.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.scaleX >= 0){
                    this.player.flipX = true;
                }
                this.player.setVelocityX(-270);
                this.scene.start('Scene2');
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