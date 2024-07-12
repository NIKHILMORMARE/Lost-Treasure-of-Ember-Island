const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preloadLevel1,
        create: createLevel1,
        update: updateLevel1
    }
};

const game = new Phaser.Game(config);

let score = 0;
let scoreText;
let totalTreasures;
let bgm; // Variable for background music

function resetGame() {
    score = 0;
    totalTreasures = 0; // Reset total treasures if needed
    if (bgm) bgm.stop(); // Stop the background music if it exists
    game.scene.stop('level1');
    game.scene.stop('level2');
    game.scene.stop('level3');
    game.scene.stop('level4');
    game.scene.stop('level5');
    game.scene.start('mainMenu'); // Restart by transitioning to the main menu
}

function preloadLevel1() {
    this.load.image('background', 'assets/1/background.png');
    this.load.image('player', 'assets/1/player.png');
    this.load.image('ground', 'assets/1/ground.png');
    this.load.image('treasure', 'assets/1/treasure.png');
    this.load.image('enemy', 'assets/1/enemy.png');
    this.load.image('rock', 'assets/rock.png'); // Load the rock image
    this.load.audio('collect', 'assets/collect.mp3');
    this.load.audio('bgm', 'assets/background-music.mp3'); // Load background music
}

function createLevel1() {
    this.add.image(400, 300, 'background').setDisplaySize(800, 600);

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'player').setScale(0.2);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);

    totalTreasures = 12;

    const treasures = this.physics.add.group({
        key: 'treasure',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    treasures.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(treasures, platforms);
    this.physics.add.overlap(this.player, treasures, collectTreasure, null, this);

    // Create a group for enemies
    this.enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 0, // Adjust the number of enemies as needed
        setXY: { x: 200, y: 100, stepX: 150 }
    });

    this.enemies.children.iterate(function (enemy) {
        enemy.setBounce(1);
        enemy.setCollideWorldBounds(true);
        enemy.setVelocity(Phaser.Math.Between(-100, 100), 20);
    });

    this.physics.add.collider(this.enemies, platforms);
    this.physics.add.overlap(this.player, this.enemies, hitEnemy, null, this);

    this.rocks = this.physics.add.group();
    this.time.addEvent({
        delay: 2000, // Adjust the delay between rock throws
        callback: this.throwRock,
        callbackScope: this,
        loop: true
    });

    this.collectSound = this.sound.add('collect');

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });

    this.cursors = this.input.keyboard.createCursorKeys();

    // Play background music
    bgm = this.sound.add('bgm');
    bgm.play({ loop: true });
}

function updateLevel1() {
    this.player.setVelocityX(0);

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
    }

    // Additional enemy behavior can be added here
}

function collectTreasure(player, treasure) {
    treasure.disableBody(true, true);
    score += 10;
    totalTreasures -= 1;
    scoreText.setText('Score: ' + score);
    this.collectSound.play();

    if (totalTreasures <= 0) {
        bgm.stop(); // Stop music when transitioning to next level
        this.scene.start('level2');
    }
}

function hitEnemy(player, enemy) {
    bgm.stop(); // Stop music if the player hits the enemy
    this.scene.start('mainMenu');
}

function throwRock() {
    this.enemies.children.iterate((enemy) => {
        const rock = this.rocks.create(enemy.x, enemy.y, 'rock');
        rock.setVelocityY(500); // Adjust the speed of the falling rock
        rock.setCollideWorldBounds(true);
        rock.setBounce(0.2);
        this.physics.add.collider(rock, this.platforms, (rock, platform) => {
            rock.disableBody(true, true); // Disable the rock upon collision with the platform
        });
        this.physics.add.collider(this.player, rock, hitEnemy, null, this);
    });
}
