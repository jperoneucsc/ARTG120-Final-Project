// TEST SCENE FOR PROTOTYPING MOVEMENT

// Projectiles for Light Bear Group
class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'projectile');
    }

    fire(flipx, x,y){
        this.play('projectile-flying');
        this.body.setAllowGravity(false);
        this.setActive(true);
        this.setVisible(true);
        if(flipx == true){
            this.body.reset(x-50,y);
            this.setVelocityX(-550);
        }
        if(flipx == false){
            this.body.reset(x+50,y);
            this.setVelocityX(550);
        }
    }
}


class ProjectileGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Projectile,
            frameQuantity: 100,
            active: false,
            visible: false,
            key: 'projectile'
        })
    }

    fireProjectile(flipx, x, y){
        const projectile = this.getFirstDead(false);
        if (projectile){
            projectile.fire(flipx, x,y-32);
        }
    }
}




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

        // Load platform
        this.load.image("platform", "src/assets/platform.png");

        // load crate asset
        this.load.image("crate", "src/assets/crate.png")
        // load projectile asset
        this.load.atlas("projectile", "src/assets/projectile.png", "src/assets/projectile.json");

        // load nextscene temp asset
        this.load.image("nextScene", "src/assets/nextScene.png");

        // load music and sound effects
        this.load.audio('firstSceneSong', 'src/assets/audio/ScaryThingsOriginal.mp3')
        this.load.audio('walkAudio', 'src/assets/audio/Walk.mp3');
        this.load.audio('runAudio', 'src/assets/audio/Run.mp3');
        this.load.audio('dashAudio', 'src/assets/audio/Dash.mp3');
        this.load.audio('wallBreakAudio', 'src/assets/audio/WallBreak.mp3');
        this.load.audio('jumpAudio', 'src/assets/audio/JumpSoundEffectRetro.mp3');
        this.load.audio('strikeAudio', 'src/assets/audio/PalmStrikeSwing.mp3');
        this.load.audio('endSceneMusic', 'src/assets/audio/InTheRainAtDusk.mp3');

        // load projectiles in
        this.ProjectileGroup;
    }

    create()
    {
        // console.log("Scene1 Starting");
        // Create animations ------------------------------------------------
        this.anims.create({
            key: 'projectile-flying',
            framerate: 4,
            frames: this.anims.generateFrameNames('projectile', {
                start: 1,
                end: 4,
                prefix:"ball",
                suffix: '.png'
            }),
            repeat: -1
        })
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
            frameRate: 9,
            frames: this.anims.generateFrameNames('LightBear', {
                start: 1,
                end: 4,
                prefix: 'LightBearStrike-0',
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
        this.firstSong = this.sound.add('firstSceneSong', {volume: 0.1});
        this.firstSong.loop = true;
        this.firstSong.play();

        this.walkSound = this.sound.add('walkAudio', {volume : 0.2});
        this.walkSound.loop = true;

        this.runSound = this.sound.add('runAudio', {volume : 0.2});
        this.runSound.loop = true;

        this.jumpSound = this.sound.add('jumpAudio', {volume : 0.05, detune: -400});

        this.strikeSound = this.sound.add('strikeAudio', {volume : 0.05});

        this.wallBreakSound = this.sound.add('wallBreakAudio', {volume : 0.1});

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
        platforms.create(width*.15, sceneHeight*.7, "ground").setScale(1).setSize(1280,40);

        platforms.create(1300, sceneHeight*.8, "platform").setScale(1).setSize(500,35);
        platforms.create(1700, sceneHeight*.6, "platform").setScale(1).setSize(500,35);
        platforms.create(1100, sceneHeight*.4, "platform").setScale(1).setSize(500,35);
        platforms.create(1700, sceneHeight*.2, "platform").setScale(1).setSize(500,35);

        // create crate group

        const crates = this.physics.add.staticGroup();

        // Add scene changer in the bottom right corner
        this.nextScene = this.physics.add.sprite(1700, sceneHeight*.1, 'nextScene').setSize(20,20);
        this.nextScene.body.setAllowGravity(false).setImmovable(true);

        // add crates
        crates.create(600,925, "crate").setScale(1.25).setImmovable(true);
        crates.create(900,925, "crate").setScale(1.25).setImmovable(true);
        crates.create(300, 925, "crate").setImmovable(true);


        crates.create(1700, sceneHeight*.1, "crate").setScale(0.9).setImmovable(true);
        
        // Create Bear
        this.player = this.physics.add.sprite(width * 0.1, height * 1.25, 'LightBear').setScale(0.27).setSize(200,490).play('player-idle');
        this.player.isStriking = false;
        this.player.isOnGround = true;

        // Add camera movement
        this.camera = this.cameras.main;
        this.camera.startFollow(this.player);

        // Set camera and world bounds
        this.camera.setBounds(0,0, sceneWidth, sceneHeight);
        this.physics.world.setBounds(0,0, sceneWidth, sceneHeight);

        // add projectiles
        this.ProjectileGroup = new ProjectileGroup(this);
        this.physics.add.overlap(this.ProjectileGroup, crates, this.hitCrate, null, this);


        // Add collider between bear and platforms and world bounds
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.player, crates);
        this.physics.add.collider(crates, platforms);
        this.player.setCollideWorldBounds(true);


        // player collision go to next scene
        this.physics.add.collider(this.player, this.nextScene, () => {
            console.log("Collision. this.scene.start(Scene2);");
            this.camera.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.game.sound.stopAll();
                this.scene.start("Scene2");
            })
        });
    }

    hitCrate(projectile, crate){
        projectile.destroy();
        this.camera.shake(200, 0.02);
        crate.setTint(0x666666);
        this.time.delayedCall(300, () =>
        {
        crate.setTint(0x333333);
        this.wallBreakSound.play();
        });
        this.time.delayedCall(200, () =>
        {
            crate.destroy();
        });
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

        // Check if player is trying to strike
        if(Phaser.Input.Keyboard.JustDown(keys.E) && (this.player.isStriking == false)){
            this.player.anims.play("player-strike");
            this.camera.shake(100, 0.001);
            this.player.isStriking = true;
            this.strikeSound.play();
            this.time.delayedCall(200, () => {
                this.ProjectileGroup.fireProjectile(this.player.flipX, this.player.x, this.player.y);
            })
            this.player.on('animationcomplete', () => {
                this.player.isStriking = false;
            })
        }

        // Check if player is pressing left or right, with shift or not
        if (cursors.left.isDown || keys.A.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.scaleX >= 0){
                    this.player.flipX = true;
                }
                if(this.player.isStriking == false){this.player.setVelocityX(-270)}else this.player.setVelocityX(this.player.body.velocity.x + 5);
                if(this.player.isOnGround && this.player.isStriking == false){this.player.anims.play("player-run", true);}
            }else{      // player is walking
                if(this.player.scaleX >= 0){
                    this.player.flipX = true;
                }
                if(this.player.isStriking == false){this.player.setVelocityX(-160)}else this.player.setVelocityX(this.player.body.velocity.x + 5);
                if(this.player.isOnGround && this.player.isStriking == false){this.player.anims.play("player-walk", true);}
            }
        }else if (cursors.right.isDown || keys.D.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.flipX == true){
                    this.player.flipX = false;
                }
                if(this.player.isStriking == false){this.player.setVelocityX(270)}else this.player.setVelocityX(this.player.body.velocity.x - 5);
                if(this.player.isOnGround && this.player.isStriking == false){this.player.anims.play("player-run", true);}
            }else{      // player is walking
                if(this.player.flipX == true){
                    this.player.flipX = false;
                }
                if(this.player.isStriking == false){this.player.setVelocityX(160)}else this.player.setVelocityX(this.player.body.velocity.x - 5);
                if(this.player.isOnGround && this.player.isStriking == false){this.player.anims.play("player-walk", true);}
            }
        }
        
        // no key is being pressed
        if(cursors.left.isUp && keys.A.isUp && cursors.right.isUp && keys.D.isUp && cursors.up.isUp && keys.W.isUp && keys.SPACE.isUp && this.player.isStriking == false){
            this.player.anims.play('player-idle', true);
            this.player.setVelocityX(0);
            if(this.player.body.velocity.y > 0){
                this.player.anims.play('player-inair');
            }
        }


        // play sound effects
        this.player.on('animationstart', () => {
            if (this.player.anims.currentAnim.key == 'player-walk'){
                this.walkSound.play();
            }
            if (this.player.anims.currentAnim.key == 'player-run'){
                this.runSound.play();
            }
        });
        this.player.on('animationstop', () => {
            if (this.player.anims.currentAnim.key == 'player-walk'){
                this.time.delayedCall(200, () => {
                    this.walkSound.stop();
                })
            }
            if (this.player.anims.currentAnim.key == 'player-run'){
                this.time.delayedCall(200, () => {
                    this.runSound.stop();
                })
            }
        });

        // Check if player is trying to jump
        if(Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(keys.W) || Phaser.Input.Keyboard.JustDown(keys.SPACE)){
            if(this.player.isOnGround){
                this.player.setVelocityY(-700);
                this.player.anims.play("player-jump");
                this.jumpSound.play();
                this.player.allowedToDoubleJump = true;
            }
            else {
                if(this.player.allowedToDoubleJump == true){
                    this.player.allowedToDoubleJump = false;
                    this.player.setVelocityY(-800);
                    this.jumpSound.play();
                }
            }
        }
    }
}