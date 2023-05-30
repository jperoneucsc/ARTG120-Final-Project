// TEST SCENE FOR PROTOTYPING MOVEMENT

class Scene1 extends Phaser.Scene {
    constructor()
    {
        super('scene1');
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
        // get the screen width + height
        const width = this.scale.width;
        const height = this.scale.height;

        // Create animations ------------------------------------------------
        this.anims.create({
            key: 'player-idle',
            frameRate: 2,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 1,
                end: 2,
                prefix: 'LightBearIdle-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'player-walk',
            frameRate: 6,
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
            frameRate: 1,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 2,
                end: 4,
                prefix: 'LightBearJump-0',
                suffix: '.png'
            }),
            repeat: -1
        })

        // Instantiate sprites + background + foreground ---------------------------------------

        // get background
        //let background1 = this.add.image(width * 0.5, height * 0.5, 'background');
        let background1 = this.add.image(width * 0.5, height * 0.5, 'background');
        //background1.setScale(2);
        //background1.setScale(2);

        // Create platforms to walk on
        const platforms = this.physics.add.staticGroup();
        platforms.create(width*0.5, height * .95, "ground").setScale(1);

        // Create Bear
        this.player = this.physics.add.sprite(width * 0.5, height * 0.5, 'LightBear').setScale(0.28).setSize(200,430).play('player-idle');
        // Add collider between panda and platforms
        this.physics.add.collider(this.player, platforms);
    }
    
    update()
    {  
        // -------------------------------- PLAYER MOVEMENT ---------------------------------------
        const cursors = this.input.keyboard.createCursorKeys();
        const keys = this.input.keyboard.addKeys("W,A,S,D,SPACE");

        // Check is player is able to jump
        if((!cursors.up.isDown || !keys.W.isDown || !keys.SPACE.isDown) && this.player.body.touching.down){
            this.player.allowedToJump = true;
            this.player.allowedToDoubleJump = false;
        }
        // Check if player is pressing left or right, with shift or not
        if(!this.player.body.touching.down){this.player.anims.play("player-jump", false)};
        if (cursors.left.isDown || keys.A.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.scaleX >= 0){
                    this.player.scaleX = this.player.scaleX * -1;
                }
                this.player.setVelocityX(-240);
                this.player.anims.play("player-run", true);
            }else{      // player is walking
                if(this.player.scaleX >= 0){
                    this.player.scaleX = this.player.scaleX * -1;
                }
                this.player.setVelocityX(-160);
                this.player.anims.play("player-walk", true);
            }
            
        }else if (cursors.right.isDown || keys.D.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.scaleX <= 0){
                    this.player.scaleX = this.player.scaleX * -1;
                }
                this.player.setVelocityX(240);
                this.player.anims.play("player-run", true);
            }else{      // player is walking
                if(this.player.scaleX <= 0){
                    this.player.scaleX = this.player.scaleX * -1;
                }
                this.player.setVelocityX(160);
                this.player.anims.play("player-walk", true);
            }
        }else{      // no key is being pressed
            this.player.setVelocityX(0);
            this.player.anims.play("player-idle", true);
        }

        // Check if player is trying to jump
        if(Phaser.Input.Keyboard.JustDown(cursors.up)){
            if(this.player.body.touching.down){
                if (this.player.body.velocity.x == 0){
                    this.player.anims.play("player-jump");
                }
                this.player.setVelocityY(-300);
                this.player.allowedToDoubleJump = true;
            }
            else {
                if(this.player.allowedToDoubleJump == true){
                    this.player.allowedToDoubleJump = false;
                    this.player.setVelocityY(-300);
                }
            }

            }
        }
/*
        // Check if player is trying to double jump
        if((cursors.up.isDown || keys.W.isDown || keys.SPACE.isDown) && Phaser.Input.Keyboard.JustDown(cursors.up)){
            this.player.anims.play("player-jump");
            this.player.setVelocityY(-300);
            this.player.allowedToDoubleJump = false;
        }
        
    }
    */
}
    