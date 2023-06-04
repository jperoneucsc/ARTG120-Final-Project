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

        // load crate asset
        this.load.image("crate", "src/assets/crate.png")
        // load projectile asset
        this.load.atlas("projectile", "src/assets/projectile.png", "src/assets/projectile.json");

        // load nextscene temp asset
        this.load.image("nextScene", "src/assets/nextScene.png");

        // load music and sound effects
        this.load.audio('walkAudio', 'src/assets/audio/Walk.mp3');
        this.load.audio('runAudio', 'src/assets/audio/Run.mp3');
        this.load.audio('dashAudio', 'src/assets/audio/Dash.wav');
        this.load.audio('wallBreakAudio', 'src/assets/audio/WallBreak.wav');
        this.load.audio('jumpAudio', 'src/assets/audio/JumpSoundEffectRetro.wav');
        this.load.audio('strikeAudio', 'src/assets/audio/PalmStrikeSwing.mp3');
        this.load.audio('endSceneMusic', 'src/assets/audio/InTheRainAtDusk.mp3');

        // load projectiles in
        this.ProjectileGroup;
    }

    create()
    {
        console.log("Scene1 Starting");
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
        let walkSound = this.sound.add('walkAudio');
        walkSound.loop = true;
        
        this.strikeSound = this.sound.add('strikeAudio', {volume : 0.1});

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

        // create crate group

        const crates = this.physics.add.staticGroup();

        // Add scene changer in the bottom right corner
        this.nextScene = this.physics.add.sprite(100, 450, 'nextScene').setSize(20,20);
        this.nextScene.body.setAllowGravity(false).setImmovable(true);

        // add crates
        crates.create(1500,510, "crate").setImmovable(true);
        crates.create(1500,320, "crate").setImmovable(true);

        
        // Create Bear
        this.player = this.physics.add.sprite(width * 0.52, height * 0.5, 'LightBear').setScale(0.27).setSize(200,490).play('player-idle');
        this.player.isStriking = false;

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
                this.scene.start("Scene2");
            })
        });
    }

    hitCrate(projectile, crate){
        projectile.destroy();
        crate.setTint(0x666666);
        this.time.delayedCall(300, () =>
        {
        crate.setTint(0x333333);
        });
        this.time.delayedCall(200, () =>
        {
            crate.destroy();
        });
    }
    
    addEvents(){
        this.input.on('pointerdown', pointer => {
            // shoot projectile
            console.log("GSDF");
            this.ProjectileGroup.fireProjectile(this.player.flipX, this.player.x, this.player.y);
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
        if(Phaser.Input.Keyboard.JustDown(keys.E) && (this.player.isStriking == false)){
            // currently animations will interfere with eachother and not play properly
            // until this is fixed the strike animation will not workeeeweeea 
            this.player.anims.play("player-strike");
            this.player.isStriking = true;
            this.strikeSound.play();
            this.time.delayedCall(200, () => {
                this.ProjectileGroup.fireProjectile(this.player.flipX, this.player.x, this.player.y);
            })
            this.player.on('animationcomplete', () => {
                this.player.isStriking = false;
            })
            // this.scene.start("Scene2"); // for scene debugging pressing e will switch scenes
            // Insert code for breaking walls and stuff here
        }

        // Check if player is pressing left or right, with shift or not
        if (cursors.left.isDown || keys.A.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.scaleX >= 0){
                    this.player.flipX = true;
                }
                if(this.player.isStriking == false){this.player.setVelocityX(-270)}else this.player.setVelocityX(this.player.body.velocity.x + 10);
                if(this.player.body.touching.down && this.player.isStriking == false){this.player.anims.play("player-run", true);}
            }else{      // player is walking
                if(this.player.scaleX >= 0){
                    this.player.flipX = true;
                }
                if(this.player.isStriking == false){this.player.setVelocityX(-160)}else this.player.setVelocityX(this.player.body.velocity.x + 10);
                if(this.player.body.touching.down && this.player.isStriking == false){this.player.anims.play("player-walk", true);}
            }
        }else if (cursors.right.isDown || keys.D.isDown){
            if(cursors.shift.isDown){    // player is running
                if(this.player.flipX == true){
                    this.player.flipX = false;
                }
                if(this.player.isStriking == false){this.player.setVelocityX(270)}else this.player.setVelocityX(this.player.body.velocity.x - 10);
                if(this.player.body.touching.down && this.player.isStriking == false){this.player.anims.play("player-run", true);}
            }else{      // player is walking
                if(this.player.flipX == true){
                    this.player.flipX = false;
                }
                if(this.player.isStriking == false){this.player.setVelocityX(160)}else this.player.setVelocityX(this.player.body.velocity.x - 10);
                if(this.player.body.touching.down && this.player.isStriking == false){this.player.anims.play("player-walk", true);}
            }
        }
        
        // no key is being pressed
        if(cursors.left.isUp && keys.A.isUp && cursors.right.isUp && keys.D.isUp && cursors.up.isUp && keys.W.isUp && keys.SPACE.isUp && this.player.isStriking == false){
            this.player.anims.play('player-idle', true);
            this.player.setVelocityX(0);
            if(this.player.body.velocity.y > 100){
                this.player.anims.play('player-inair');
            }
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
    