class PracticeEnd extends Phaser.Scene {
    constructor() { super({ key: "PracticeEnd" }); }

    create() {
			
			this.makeText(300, 'Great\n\n\nYou have finished practice.\n\nYou can now press the spacebar to begin the game')
			this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
      if (this.keySpace.isDown) {
				this.scene.start("Trial")
      	}
		}

	makeText(y, text, font, origin) {
		if ((y == undefined) || (text == undefined)) 
			return;

		if (font == undefined) font = f.instructions.regular;
		if (origin == undefined) origin = 0.5;

		let style = 'normal';
		let textFont = {
			fontFamily: font.fam, 
			fontSize: 24,
			color: font.color,
			style: style,
		};

		if (font.style !== undefined) textFont.style = font.style;
		if (font.wordWrap !== undefined) textFont.wordWrap = {  width: 700, useAdvancedWrap: false };

		return this.add.text(450, y, text, textFont).setOrigin(origin).setAlign('justify');

	}

}