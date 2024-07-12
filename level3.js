class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: 'level3' });
    }

    preload() {
        this.load.image('background3', 'assets/3/background3.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('ground3', 'assets/3/ground3.png');
        this.load.image('treasure3', 'assets/3/treasure3.png');
        this.load.image('enemy3', 'assets/3/enemy3.png');
        // this.load.image('rock', 'assets/rock.png'); // Load the rock image
        this.load.audio('collect', 'assets/collect.mp3');
        this.load.audio('bgm', 'assets/background-music.mp3'); // Load background music
    }

    create() {
        this.add.image(400, 300, 'background3').setDisplaySize(800, 600);

        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground3').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground3'); // Adjusted positions for Level 3
        platforms.create(50, 250, 'ground3');
        platforms.create(750, 250, 'ground3');

        this.player = this.physics.add.sprite(100, 450, 'player').setScale(0.2);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

        const treasures = this.physics.add.group({
            key: 'treasure3',
            repeat: 7,
            setXY: { x: 12, y: 0, stepX: 100 }
        });

        treasures.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(treasures, platforms);
        this.physics.add.overlap(this.player, treasures, this.collectTreasure, null, this);

        // Create a group for enemies
        this.enemies = this.physics.add.group({
            key: 'enemy3',
            repeat: 1, // Adjust the number of enemies as needed
            setXY: { x: 200, y: 100, stepX: 150 }
        });

        this.enemies.children.iterate(function (enemy) {
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(Phaser.Math.Between(-50, 50), 10); // Adjust enemy speed
        });

        this.physics.add.collider(this.enemies, platforms);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

        // Group for rocks
        // this.rocks = this.physics.add.group();
        // this.time.addEvent({
        //     delay: 2000, // Adjust the delay between rock throws
        //     callback: this.throwRock,
        //     callbackScope: this,
        //     loop: true
        // });

        this.bgm = this.sound.add('bgm'); // Add background music
        this.bgm.play({ loop: true }); // Play background music in loop

        this.collectSound = this.sound.add('collect');

        this.scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ffffff' });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.remainingTreasures = 8; // Track remaining treasures (total is 8: 7 repeat + 1)
    }

    update() {
        this.player.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350); // Adjusted jump height for Level 3
        }
    }

    collectTreasure(player, treasure) {
        treasure.disableBody(true, true);
        score += 10;
        this.scoreText.setText('Score: ' + score);
        this.collectSound.play();
        
        this.remainingTreasures -= 1;

        // Check if all treasures are collected
        if (this.remainingTreasures <= 0) {
            this.bgm.stop(); // Stop music when transitioning to next level
            this.scene.start('level4'); // Transition to Level 4
        }
    }

    hitEnemy(player, enemy) {
        this.bgm.stop(); // Stop music if the player hits the enemy
        this.scene.start('mainMenu');
    }

    // throwRock() {
    //     this.enemies.children.iterate((enemy) => {
    //         const rock = this.rocks.create(enemy.x, enemy.y, 'rock');
    //         rock.setVelocityY(500); // Adjust the speed of the falling rock
    //         rock.setCollideWorldBounds(true);
    //         rock.setBounce(0.2);
    //         this.physics.add.collider(rock, this.platforms, (rock, platform) => {
    //             rock.disableBody(true, true); // Disable the rock upon collision with the platform
    //         });
    //         this.physics.add.collider(this.player, rock, this.hitEnemy, null, this);
    //     });
    // }
}

game.scene.add('level3', Level3);
