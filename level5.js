class Level5 extends Phaser.Scene {
    constructor() {
        super({ key: 'level5' });
    }

    preload() {
        this.load.image('background5', 'assets/5/background5.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('ground5', 'assets/5/ground5.png');
        this.load.image('treasure5', 'assets/5/treasure5.png');
        this.load.image('enemy5', 'assets/5/enemy5.png');
        // this.load.image('rock', 'assets/rock.png'); // Load the rock image
        this.load.audio('collect', 'assets/collect.mp3');
        this.load.audio('bgm', 'assets/background-music.mp3'); // Load background music for Level 5
    }

    create() {
        this.add.image(400, 300, 'background5').setDisplaySize(800, 600);

        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground5').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground5'); // Adjusted positions for Level 5
        platforms.create(50, 250, 'ground5');
        platforms.create(750, 250, 'ground5');

        this.player = this.physics.add.sprite(100, 450, 'player').setScale(0.2);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

        this.remainingTreasures = 8;

        const treasures = this.physics.add.group({
            key: 'treasure5',
            repeat: 7,
            setXY: { x: 12, y: 0, stepX: 100 }
        });

        treasures.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(treasures, platforms);
        this.physics.add.overlap(this.player, treasures, this.collectTreasure, null, this);

        this.enemies = this.physics.add.group({
            key: 'enemy5',
            repeat: 0, // Adjust the number of enemies as needed
            setXY: { x: 200, y: 100, stepX: 150 }
        });

        this.enemies.children.iterate(function (enemy) {
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
        });

        this.physics.add.collider(this.enemies, platforms);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

        // Commenting out rock throwing code
        // this.rocks = this.physics.add.group();
        // this.time.addEvent({
        //     delay: 2000, // Adjust the delay between rock throws
        //     callback: this.throwRock,
        //     callbackScope: this,
        //     loop: true
        // });

        this.bgm = this.sound.add('bgm'); // Add background music for Level 5
        this.bgm.play({ loop: true }); // Play background music in loop

        this.collectSound = this.sound.add('collect');

        this.scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ffffff' });

        // Create cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Completion elements
        this.congratsText = this.add.text(400, 300, 'Congratulations!', {
            fontSize: '64px',
            fill: '#ff0',
            fontFamily: 'Arial Black',
            stroke: '#000',
            strokeThickness: 6,
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: '#000',
                blur: 5,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5).setVisible(false);

        this.finalScoreText = this.add.text(400, 400, 'Your Score: ' + score, {
            fontSize: '32px',
            fill: '#0f0',
            fontFamily: 'Arial Black',
            stroke: '#000',
            strokeThickness: 6,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 3,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5).setVisible(false);

        const restartButton = this.add.text(400, 500, 'Restart', {
            fontSize: '32px',
            fill: '#f00',
            fontFamily: 'Arial Black',
            backgroundColor: '#000',
            stroke: '#fff',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#fff',
                blur: 2,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5).setInteractive().setVisible(false);

        restartButton.on('pointerdown', () => {
            resetGame(); // Call the reset function when the button is clicked
        });

        this.restartButton = restartButton; // Save reference for later use
    }

    update() {
        this.player.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350); // Adjusted jump height for Level 5
        }
    }

    collectTreasure(player, treasure) {
        treasure.disableBody(true, true);
        score += 10;
        this.remainingTreasures -= 1;
        this.scoreText.setText('Score: ' + score);
        this.collectSound.play();

        // Check if all treasures are collected
        if (this.remainingTreasures <= 0) {
            this.bgm.stop(); // Stop music
            this.showCompletionMessage();
        }
    }

    showCompletionMessage() {
        // Hide gameplay elements
        this.physics.pause();
        this.player.setTint(0x00ff00);
        this.enemies.children.iterate((enemy) => {
            enemy.setTint(0xff0000);
        });

        // Show completion UI
        this.congratsText.setVisible(true);
        this.finalScoreText.setVisible(true).setText('Your Score: ' + score);
        this.restartButton.setVisible(true);
    }

    hitEnemy(player, enemy) {
        this.bgm.stop(); // Stop music if the player hits the enemy
        this.scene.start('mainMenu');
    }
}

// Add the scene to the game
game.scene.add('level5', Level5);
