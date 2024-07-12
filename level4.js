class Level4 extends Phaser.Scene {
    constructor() {
        super({ key: 'level4' });
    }

    preload() {
        this.load.image('background4', 'assets/4/background4.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('ground4', 'assets/4/ground4.png');
        this.load.image('treasure4', 'assets/4/treasure4.png');
        this.load.image('enemy4', 'assets/4/enemy4.png');
        // this.load.image('rock', 'assets/rock.png'); // Load the rock image
        this.load.audio('collect', 'assets/collect.mp3');
        this.load.audio('bgm', 'assets/background-music.mp3');
    }

    create() {
        this.add.image(400, 300, 'background4').setDisplaySize(800, 600);

        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground4').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground4');
        platforms.create(50, 250, 'ground4');
        platforms.create(750, 220, 'ground4');

        this.player = this.physics.add.sprite(100, 450, 'player').setScale(0.2);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

        this.remainingTreasures = 6;

        const treasures = this.physics.add.group({
            key: 'treasure4',
            repeat: 5,
            setXY: { x: 12, y: 0, stepX: 150 }
        });

        treasures.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(treasures, platforms);
        this.physics.add.overlap(this.player, treasures, this.collectTreasure, null, this);

        this.enemies = this.physics.add.group({
            key: 'enemy4',
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

        this.bgm = this.sound.add('bgm');
        this.bgm.play({ loop: true });

        this.collectSound = this.sound.add('collect');

        this.scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ffffff' });

        // Create cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-350);
        }
    }

    collectTreasure(player, treasure) {
        treasure.disableBody(true, true);
        score += 10;
        this.remainingTreasures -= 1;
        this.scoreText.setText('Score: ' + score);
        this.collectSound.play();

        if (this.remainingTreasures <= 0) {
            this.bgm.stop();
            this.scene.start('level5'); // Transition to Level 5
        }
    }

    hitEnemy(player, enemy) {
        this.bgm.stop();
        this.scene.start('mainMenu');
    }
}

// Add the scene to the game
game.scene.add('level4', Level4);
