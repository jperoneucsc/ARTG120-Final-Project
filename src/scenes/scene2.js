// Second Scene
// Dark Bear tutorial level

// Currently in prototype stage

class Scene2 extends Phaser.Scene {
    constructor()
    {
        super('Scene2');
    }

    preload()
    {
        // Load panda sprite sheet
        this.load.atlas('DarkBear', 'src/assets/DarkBear.png', 'src/assets/DarkBear.json');

        // Load background
        this.load.image("yangSky", "src/assets/YangSky.png")
        this.load.image("backgroundYang", "src/assets/YangMountainFull.png");
        this.load.image("backgroundYang2", "src/assets/YangMountainForeground.png");
        this.load.image("backgroundYang3", "src/assets/YangMountainForeground2.png");

        // load music and sound effects
        this.load.audio('secondSong', 'src/assets/audio/ScaryThingsModified.mp3')
        this.load.audio('walkAudio', 'src/assets/audio/Walk.mp3');
        this.load.audio('runAudio', 'src/assets/audio/Run.mp3');
        this.load.audio('dashAudio', 'src/assets/audio/Dash.mp3');
        this.load.audio('wallBreakAudio', 'src/assets/audio/WallBreak.mp3');
        this.load.audio('jumpAudio', 'src/assets/audio/JumpSoundEffectRetro.mp3');
        this.load.audio('dashAudio', 'src/assets/audio/Dash.mp3');
        this.load.audio('endSceneMusic', 'src/assets/audio/InTheRainAtDusk.mp3');

        // load nextscene temp asset
        this.load.image("nextScene", "src/assets/nextScene.png");

        // Load ground
        this.load.image("ground", "src/assets/forestFloor.png");
        // load spikes
        this.load.image("spikes", "src/assets/spikes.png");
        // load platform
        this.load.image('platform', "src/assets/platform.png");
    }

    create()
    {
        this.game.sound.stopAll();
        console.log("Scene2 Starting");
        // Create dark bear animations ------------------------------------------------
        this.anims.create({
            key: 'dark-idle',
            frameRate: 3,
            frames: this.anims.generateFrameNames('DarkBear', {
                start: 1,
                end: 8,
                prefix: 'DarkBearIdle-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'dark-walk',
            frameRate: 7,
            frames: this.anims.generateFrameNames('DarkBear', {
                start: 2,
                end: 6,
                prefix: 'DarkBearWalk-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'dark-run',
            frameRate: 8,
            frames: this.anims.generateFrameNames('DarkBear', {
                start: 1,
                end: 3,
                prefix: 'DarkBearRun-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'dark-jump',
            frameRate: 6,
            frames: this.anims.generateFrameNames('DarkBear', {
                start: 1,
                end: 2,
                prefix: 'DarkBearJump-0',
                suffix: '.png'
            }),
            repeat: 0
        })
        this.anims.create({
            key: 'dark-inair',
            frameRate: 6,
            frames: this.anims.generateFrameNames('DarkBear', {
                start: 2,
                end: 2,
                prefix: 'DarkBearJump-0',
                suffix: '.png'
            }),
            repeat: -1
        })
        this.anims.create({
            key: 'dark-dash',
            frameRate: 16,
            frames: this.anims.generateFrameNames('DarkBear', {
                start: 1,
                end: 4,
                prefix: 'DarkBearDash-0',
                suffix: '.png'
            }),
            repeat: 0
        })

        // Get the screen width + height
        const width = this.scale.width;
        const height = this.scale.height;

        const sceneWidth = 1920;
        const sceneHeight = 1080;

        // --------------------------------- Instantiate sounds -----------------------------------------
        this.secondSong = this.sound.add('secondSong', {volume: 0.07});
        this.secondSong.loop = true;
        this.secondSong.play();

        this.walkSound = this.sound.add('walkAudio', {volume : 0.2});
        this.walkSound.loop = true;

        this.runSound = this.sound.add('runAudio', {volume : 0.2});
        this.runSound.loop = true;

        this.jumpSound = this.sound.add('jumpAudio', {volume : 0.05, detune: -400});

        this.dashSound = this.sound.add('dashAudio', {volume : 0.05});

        this.wallBreakSound = this.sound.add('wallBreakAudio', {volume : 0.1});
        
        // ------------------------ Instantiate sprites + background + foreground -------------------------

        // get background
        let background1 = this.add.image(500, 470, 'backgroundYang').setScrollFactor(0.02);

        let yangSky = this.add.image(800, 400, "yangSky").setScrollFactor(0).setScale(.7);
        // get foreground mountains
        let background3 = this.add.image(-100, 25, 'backgroundYang3').setOrigin(0,0).setScrollFactor(0.03);
        let background2 = this.add.image(0, 100, 'backgroundYang2').setOrigin(0,0).setScrollFactor(0.04);


        // Create platforms to walk on
        const platforms = this.physics.add.staticGroup();
        //platforms.create(width*.5, sceneHeight, "ground").setScale(1).setSize(1280,40);   // first floor
        platforms.create(width*2, sceneHeight-30, "ground").setScale(1).setSize(1280,40); 
        //platforms.create(width*.95, sceneHeight*.5, "ground").setScale(1).setSize(1280,40);
        platforms.create(800, sceneHeight*.9, "platform").setScale(1).setSize(500,35);
        platforms.create(1300, sceneHeight*.9, "platform").setScale(1).setSize(500,35);

        // layer 2
        platforms.create(1700, 750, "platform").setScale(1).setSize(500,35);
        // layer 3
        platforms.create(1400, 500, "platform").setScale(1).setSize(500,35);
        // layer 4
        platforms.create(1100, 300, "platform").setScale(1).setSize(500,35);

        platforms.create(0, sceneHeight*.6, "platform").setScale(1).setSize(500,35); // end platform
        



        const deathplatforms = this.physics.add.staticGroup();
        deathplatforms.create(820, 1100, "spikes").setScale(0.5).setSize(1920, 10);
        deathplatforms.create(1500, 1100, "spikes").setScale(0.5).setSize(1920, 10);
        deathplatforms.create(0, 1100, "spikes").setScale(0.5).setSize(1920, 10);

        // next scene temp asset
        this.nextScene = this.physics.add.sprite(200, 550, 'nextScene').setSize(20,20);
        this.nextScene.body.setAllowGravity(false).setImmovable(true);

        // Create Bear
        this.player = this.physics.add.sprite(2300, sceneHeight * 0.7, 'DarkBear').setScale(0.27).setSize(200,490).play('dark-idle');
        this.player.isDashing = false;

        // Add camera movement
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);

        // Set camera and world bounds
        this.camera.setBounds(0,0, 2500, 1080);
        this.physics.world.setBounds(0,0, 2500, 1080);

        // Add collider between bear and platforms and world bounds
        this.physics.add.collider(this.player, platforms);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, deathplatforms, () => {
            this.game.sound.stopAll();
            this.scene.start("Scene2");
        });

        // player collision go to next scene
        this.physics.add.collider(this.player, this.nextScene, () => {
            this.scene.start("Scene1");
        });
    }

    DashAnimation(){
        this.player.anims.play("dark-dash");
        this.camera.shake(100, 0.001);
        this.player.isDashing = true;
        this.dashSound.play();
        this.player.on('animationcomplete', () => {
            this.player.isDashing = false;
        })
    }


    update()
    {  
        
        // -------------------------------- PLAYER MOVEMENT ---------------------------------------
        const cursors = this.input.keyboard.createCursorKeys();
        const keys = this.input.keyboard.addKeys("W,A,S,D,E,SPACE");

        // Checkif player is touching the ground
        if(this.player.body.touching.down){
            this.player.isOnGround = true;
        }else this.player.isOnGround = false;

        // Check is player is able to jump
        if((!cursors.up.isDown || !keys.W.isDown || !keys.SPACE.isDown) && this.player.isOnGround){
            this.player.allowedToDoubleJump = false;
        }

    

        // Check if player is pressing left or right, with shift or not
        if (cursors.left.isDown || keys.A.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.flipX == true){
                    this.player.flipX = false;
                }
                this.player.setVelocityX(-270);
                if(this.player.isOnGround && this.player.isDashing == false){this.player.anims.play("dark-run", true);}
                if(Phaser.Input.Keyboard.JustDown(keys.E) && (this.player.isDashing == false)){
                    this.DashAnimation();
                    this.player.setVelocityX(-10070);
                }
            }else{      // player is walking
                if(this.player.flipX == true){
                    this.player.flipX = false;
                }
                this.player.setVelocityX(-160);
                if(this.player.isOnGround && this.player.isDashing == false){this.player.anims.play("dark-walk", true);}
                if(Phaser.Input.Keyboard.JustDown(keys.E) && (this.player.isDashing == false)){
                    this.DashAnimation();
                    this.player.setVelocityX(-10070);
                }
            }
            
        }else if (cursors.right.isDown || keys.D.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.flipX == false){
                    this.player.flipX = true;
                }
                this.player.setVelocityX(270);
                if(this.player.isOnGround && this.player.isDashing == false){this.player.anims.play("dark-run", true);}
                if(Phaser.Input.Keyboard.JustDown(keys.E) && (this.player.isDashing == false)){
                    this.DashAnimation();
                    this.player.setVelocityX(10070);
                }
            }else{      // player is walking
                if(this.player.flipX == false){
                    this.player.flipX = true;
                }
                this.player.setVelocityX(160);
                if(this.player.isOnGround && this.player.isDashing == false){this.player.anims.play("dark-walk", true);}
                if(Phaser.Input.Keyboard.JustDown(keys.E) && (this.player.isDashing == false)){
                    this.DashAnimation();
                    this.player.setVelocityX(10070);
                }
            }
        }
        // no key is being pressed
        if(cursors.left.isUp && keys.A.isUp && cursors.right.isUp && keys.D.isUp && cursors.up.isUp && keys.W.isUp && keys.SPACE.isUp && this.player.isDashing == false){
            this.player.anims.play('dark-idle', true);
            this.player.setVelocityX(0);
            if(this.player.body.velocity.y > 0){
                this.player.anims.play('dark-inair');
            }
        }

        // play sound effects
        this.player.on('animationstart', () => {
            if (this.player.anims.currentAnim.key == 'dark-walk'){
                this.walkSound.play();
            }
            if (this.player.anims.currentAnim.key == 'dark-run'){
                this.runSound.play();
            }
        });
        this.player.on('animationstop', () => {
            if (this.player.anims.currentAnim.key == 'dark-walk'){
                this.time.delayedCall(200, () => {
                    this.walkSound.stop();
                })
            }
            if (this.player.anims.currentAnim.key == 'dark-run'){
                this.time.delayedCall(200, () => {
                    this.runSound.stop();
                })
            }
        });

        // Check if player is trying to jump
        if(Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(keys.W) || Phaser.Input.Keyboard.JustDown(keys.SPACE)){
            if(this.player.isOnGround){
                this.player.setVelocityY(-700);
                this.jumpSound.play();
                this.player.anims.play("dark-jump");
                this.player.allowedToDoubleJump = true;
            }
            else {
                if(this.player.allowedToDoubleJump == true){
                    this.player.allowedToDoubleJump = false;
                    this.jumpSound.play();
                    this.player.setVelocityY(-800);
                }
            }
        }
    }
}