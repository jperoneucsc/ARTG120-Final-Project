// TEST SCENE FOR PROTOTYPING MOVEMENT

class Scene1 extends Phaser.Scene {
    constructor()
    {
        super('scene1');
    }

    preload()
    {
        // Load panda sprite sheet
        this.load.atlas('panda1', '/src/assets/panda.png', '/src/assets/panda.json');

        // Load background
        this.load.image("background", "/src/assets/forestBackground.png");

        // Load ground
        this.load.image("ground", "/src/assets/forestFloor.png")


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
            frames: this.anims.generateFrameNames('panda1', {
                start: 1,
                end: 4,
                prefix: 'panda_01_idle_0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'player-walk',
            frameRate: 10,
            frames: this.anims.generateFrameNames('panda1', {
                start: 1,
                end: 8,
                prefix: 'panda_01_walk_0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'player-run',
            frameRate: 10,
            frames: this.anims.generateFrameNames('panda1', {
                start: 1,
                end: 5,
                prefix: 'panda_01_run_0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'player-jump',
            frameRate: 1,
            frames: this.anims.generateFrameNames('panda1', {
                start: 1,
                end: 5,
                prefix: 'panda_01_run_0',
                suffix: '.png'
            }),
            repeat: -1
        })

        // Instantiate sprites + background + foreground ---------------------------------------

        // get background
        let background1 = this.add.image(width * 0.5, height * 0.5, 'background');

        // Create platforms to walk on
        const platforms = this.physics.add.staticGroup();
        platforms.create(width*0.5, height * .95, "ground").setScale(1);
        platforms.create((width + width*0.5), height * .95, "ground").setScale(1).refreshBody();

        // Create Panda
        this.player = this.physics.add.sprite(width * 0.5, height * 0.5, 'panda1').setScale(0.3).play('player-idle');
        // Add collider between panda and platforms
        this.physics.add.collider(this.player, platforms);
    }
    
    update()
    {  
        // -------------------------------- PLAYER MOVEMENT ---------------------------------------
        const cursors = this.input.keyboard.createCursorKeys();

        // Check is player is able to jump
        if(!cursors.up.isDown && this.player.body.touching.down){
            this.player.allowedToJump = true;
        }

        // Check if player is pressing left or right, with shift or not
        if(!this.player.body.touching.down){this.player.anims.play("player-jump", false)};
        if (cursors.left.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.scaleX <= 0){
                    this.player.scaleX = this.player.scaleX * -1;
                }
                this.player.setVelocityX(-240);
                this.player.anims.play("player-run", true);
            }else{      // player is walking
                if(this.player.scaleX <= 0){
                    this.player.scaleX = this.player.scaleX * -1;
                }
                this.player.setVelocityX(-160);
                this.player.anims.play("player-walk", true);
            }
            
        }else if (cursors.right.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.scaleX >= 0){
                    this.player.scaleX = this.player.scaleX * -1;
                }
                this.player.setVelocityX(240);
                this.player.anims.play("player-run", true);
            }else{      // player is walking
                if(this.player.scaleX >= 0){
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
        if(cursors.up.isDown && this.player.body.touching.down && this.player.allowedToJump){
            if (this.player.body.velocity.x == 0){
                this.player.anims.play("player-jump");
            }
            this.player.setVelocityY(-600);
            this.player.allowedToJump = false;
        }

        
    }
}
    