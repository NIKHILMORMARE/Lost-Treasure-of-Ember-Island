class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'mainMenu' });
    }

    preload() {
        this.load.image('background', 'assets/mainMenuBackground.png');
    }

    create() {
        this.add.image(400, 300, 'background').setDisplaySize(800, 600);
        const playButton = this.add.text(400, 300, 'Play', { fontSize: '32px', fill: '#ffffff' });
        playButton.setInteractive();
        playButton.on('pointerdown', () => this.scene.start('level1'));
    }
}

game.scene.add('mainMenu', MainMenu);
game.scene.start('mainMenu');
