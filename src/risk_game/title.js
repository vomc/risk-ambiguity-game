class Title extends Phaser.Scene {
    constructor() { super({ key: "Title" }); }
    create() {
        document.getElementById("statusMessage").textContent = "Ready ... ";
        let text = this.add.text(450, 300, 'Risk and Ambiguity',
                {   fontFamily: f.titleLine.fam,
                    fontSize: f.titleLine.size, color: f.titleLine.color });
            text.setOrigin(0.5);
        let subtitle = this.add.text(450, 580, 'Press spacebar to continue...',
        {   fontFamily: f.spaceBarLine.fam,
            fontSize: f.spaceBarLine.size, color: f.spaceBarLine.color });
            subtitle.setOrigin(0.5);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        if (this.keySpace.isDown) {
            if (config.shortGame === true) {
                this.scene.start("Trial");
            } else {
                this.scene.start("Instructions");
            }
        }
    }
}