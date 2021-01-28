class Instructions extends Phaser.Scene {

	constructor() {
		super({ key: "Instructions" });
		this.spacebarText = 'Please tap the spacebar to continue ...';
		this.spacebarAlphaDisabled = 0;
		this.enableAdvance = false;
		this.scenesLeft = true;
		this.m = 450;

		// delay when instructions are advancing on their own
		this.instructionAnimationDelay = 1000;
		this.spacebarAlphaDisabled = 0.2;

		// general tweens
		this.tweenDuration = 1200;
		this.allowAdvanceReverse = false;
		this.instructionsFinished = false;
	}

	preload() {
		this.load.image('px', '/game_assets/one-white.png');
		this.load.image('instructions01', '/game_assets/risk-instrux01.png');
		this.load.image('instructions02', '/game_assets/risk-instrux02.png');
		this.load.image('instructions03', '/game_assets/risk-instrux03.png');
		this.load.image('instructions04', '/game_assets/risk-instrux04.png');
		this.load.image('instructions05', '/game_assets/risk-instrux05.png');
		this.load.image('instructions06', '/game_assets/risk-instrux06.png');
		this.load.image('instructions07', '/game_assets/risk-instrux07.png');
		this.load.image('instructions08', '/game_assets/risk-instrux08.png');
		this.load.image('instructions09', '/game_assets/risk-instrux09.png');
		this.load.image('instructions10', '/game_assets/risk-instrux10.png');
		this.load.image('instructions11', '/game_assets/risk-instrux11.png');
		this.load.image('instructions12', '/game_assets/risk-instrux12.png');
		this.load.image('instructions13', '/game_assets/risk-instrux13.png');
		this.load.image('instructions14', '/game_assets/risk-instrux14.png');
		this.load.image('instructions15', '/game_assets/risk-instrux15.png');
		this.load.image('instructions16', '/game_assets/risk-instrux16.png');
		this.load.image('instructions17', '/game_assets/risk-instrux17.png');
		this.load.image('instructions20', '/game_assets/risk-instrux20.png');
		this.load.image('instructions21', '/game_assets/risk-instrux21.png');

		
	}

	create() {
		this.imageScale = 0.25;
		this.textTop = 65;
		this.currentScene = 2;
	  this.buildScene2();
		this.setupKeys();
		this.setupFonts();
		
	}

	showScene(sceneNumber) {
		this.enableAdvance = false;
		switch (sceneNumber) { 
			case 1:     this.buildScene1(); break;
			case 2:     this.buildScene2(); break;
			case 3:     this.buildScene3(); break;
			case 4:     this.buildScene4(); break;
			case 5:     this.buildScene5(); break;
			case 6:     this.buildScene6(); break;
			case 7:     this.buildScene7(); break;
			case 8:     this.buildScene8(); break;
			case 9:     this.buildScene9(); break;
			case 10:     this.buildScene10(); break;
			case 11:     this.buildScene11(); break;
			case 12:     this.buildScene12(); break;
			case 13:     this.buildScene13(); break;
			case 14:     this.buildScene14(); break;
			case 15:     this.buildScene15(); break;
			case 16:     this.buildScene16(); break;
			case 17:     this.buildScene17(); break;
			case 18:     this.buildScene18(); break;
			case 19:     this.buildScene19(); break;
			case 20:     this.buildScene20(); break;
			case 21:     this.buildScene21(); break;
			case 22:     this.buildScene22(); break;
			case 23:     this.buildScene23(); break;
			case 24:     this.buildScene24(); break;
			case 25:     this.buildScene25(); break;
			case 26:     this.buildScene26(); break;
			case 27:     this.buildScene27(); break;
			case 28:     this.buildScene28(); break;
			case 29:     this.buildScene29(); break;
			case 30:     this.buildScene30(); break;
			case 31:     this.buildScene31(); break;
			case 32:     this.buildScene32(); break;
			case 33:     this.buildScene33(); break;
			case 34:     this.buildScene34(); break;
			case 35:     this.buildScene35(); break;
			case 36:     this.buildScene36(); break;
			case 37:     this.buildScene37(); break;
			case 38:     this.buildScene38(); break;
			case 39:     this.buildScene39(); break;
			case 40:     this.buildScene40(); break;
			case 41:     this.buildScene41(); break;
			case 42:     this.buildScene42(); break;
			case 43:     this.buildScene43(); break;
			
			default: console.debug("todo show scene", sceneNumber); break;
		}
	}
	disableAdvance() {
		this.enableAdvance = false;
		this.allowAdvanceReverse = false;
		this.addvanceToSpecificScene = false;

		if (this.advance !== undefined) this.advance.setAlpha(this.spacebarAlphaDisabled);
	}
	buildScene1() {
		
		this.disableAdvance();
		g.instrux.addOverlay(this);
		//this.makeTextLarge(300, 'Understanding the Game:');
		this.addAdvance();
	}
	buildScene2() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(150, 'Welcome!');
		this.makeText(300, 'This is a paid experiment. In this task you will make a series of decisions, and the amount we pay you will be based on the decisions you make.');
		this.makeText(450, 'Please read through these instructions carefully.');
		this.addAdvance();
	}
	buildScene3() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'In this experiment, you will make a series of choices between a sure amount of money, and a lottery in which you could win a larger amount.')
		this.addAdvance();
	}
	buildScene4() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'Part I: Understanding the lottery option');
		this.addAdvance();
	}
	buildScene5() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'The lottery option will be presented like this.');
		this.add.image(450, 320, 'instructions01').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene6() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'This example shows a lottery with a 75% chance of winning 12 points, and a 25% chance of getting nothing.');
		this.add.image(450, 320, 'instructions02').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene7() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'This example shows a lottery with a 75% chance of winning 12 points, and a 25% chance of getting nothing.');
		this.add.image(450, 320, 'instructions03').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene8() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'This example shows a lottery with a 75% chance of winning 12 points, and a 25% chance of getting nothing.');
		this.add.image(450, 320, 'instructions04').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene9() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'Sometimes the lottery payoff will be associated with blue:');
		this.add.image(450, 320, 'instructions07').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene10() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'Sometimes the lottery payoff will be associated with blue:');

		this.add.image(450, 320, 'instructions08').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene11() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'and sometimes with red:');
		this.add.image(450, 320, 'instructions09').setOrigin(0.5, 0.5).setScale(this.imageScale);
		
		this.addAdvance();
	}
	buildScene12() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'and sometimes with red:');

		this.add.image(450, 320, 'instructions10').setOrigin(0.5, 0.5).setScale(this.imageScale);
		
		this.addAdvance();
	}

	buildScene13() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'In some lotteries, a grey bar will hide where the blue and red areas meet, so that you will only have partial information about the chance.');
		this.add.image(450, 320, 'instructions11').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}

	buildScene14() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'These lotteries will be presented like this.');
		this.add.image(450, 320, 'instructions11').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}

	buildScene15() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'The blue and red areas represent the information you know about the chance in this lottery, while the grey area represents the information you do not know.');
		this.add.image(450, 320, 'instructions12').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}

	buildScene16() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'The blue and red areas represent the information you know about the chance in this lottery, while the grey area represents the information you do not know.');
		this.add.image(450, 320, 'instructions13').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene17() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'When combined with the number or numbers hidden by the grey area, the red and blue areas will always add to 100.');
		this.add.image(450, 320, 'instructions14').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene18() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'When combined with the number or numbers hidden by the grey area, the red and blue areas will always add to 100.');
		this.add.image(450, 320, 'instructions15').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene19() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'When combined with the number or numbers hidden by the grey area, the red and blue areas will always add to 100.');
		this.add.image(450, 320, 'instructions16').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene20() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'Because of the grey bar, you only know that the chance of winning this lottery is between 25 and 75 percent. The same is true for the chance of not winning this lottery.');
		this.add.image(450, 320, 'instructions17').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene21() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'Because of the grey bar, you only know that the chance of winning this lottery is between 25 and 75 percent. The same is true for the chance of not winning this lottery.');
		this.makeText(530, 'You do not know the exact chance for either outcome.');
		this.add.image(450, 320, 'instructions17').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}

	buildScene22() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'It’s important to note that this image represents a certain fixed chance, though you do not know that exact chance. The hidden chance information represented by the same image will not change from trial to trial.');
		this.add.image(450, 320, 'instructions11').setOrigin(0.5, 0.5).setScale(this.imageScale);
		this.addAdvance();
	}
	buildScene23() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'Part II: Understanding the task');
		this.addAdvance();
	}

	buildScene24() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'In this task you will complete four blocks of 30 trials each.');
		this.addAdvance();
	}

	buildScene25() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(this.textTop, 'This is an example of how each trial will be presented.');
		this.add.image(450, 320, 'instructions20').setOrigin(0.5, 0.5).setScale(0.75);
		this.addAdvance();
	}

	buildScene26() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(50, 'This trial is asking you to choose between 5 sure points and playing a lottery with a 13-87% chance of winning 86 points.');
		this.add.image(450, 320, 'instructions20').setOrigin(0.5, 0.5).setScale(0.75);
		this.addAdvance();
	}

	buildScene27() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'Use the left and right arrows on your keyboard to select the option you prefer. The option you choose will be highlighted.');
		this.addAdvance();
	}

	buildScene28() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(50, 'In this example image, the lottery option was chosen.');
		this.add.image(450, 320, 'instructions21').setOrigin(0.5, 0.5).setScale(0.75);
		this.addAdvance();
	}

	buildScene29() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'Each trial provides a unique situation, and is not related to the other trials. So in each trial, you should make a decision independently from other trials.');
		this.addAdvance();
	}

	buildScene30() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'Part III: Understanding the bonus payment');
		this.addAdvance();
	}

	buildScene31() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'At the end of the four blocks of trials, ONE of your trials will be randomly selected and your choice in that trial will be played out for a chance to get a real bonus payment.');
		this.addAdvance();
	}


	buildScene32() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'The points you gain on that trial will be converted to a dollar amount, which will serve as a bonus payment.\n\n\nEach point will be worth 10 cents.');
		this.addAdvance();
	}

	buildScene33() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'If you chose the sure amount on the randomly-selected trial, you would receive 5 points, equal to 50 cents.');
		this.addAdvance();
	}

	buildScene34() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'If you chose to play the lottery on the randomly-selected trial, the computer will roll the dice for you depending on lottery chances, and let you know if you won or didn’t win that lottery.');
		this.addAdvance();
	}


	buildScene35() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'If you won the lottery, you would receive a number of points equal to the lottery value for that trial.');
		this.addAdvance();
	}

	buildScene36() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'If you did not win that lottery, you would not earn any bonus points.');
		this.addAdvance();
	}
	
	buildScene37() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'You won’t know until the end of the task which trial will be randomly selected, so take each choice seriously -- real money is on the line.');
		this.addAdvance();
	}

	buildScene38() {
		this.disableAdvance();
		g.instrux.addOverlay(this);
		this.makeText(300, 'Thank you!');
		this.addAdvance();
	}
	
	buildScene39() {
		this.scene.start('Quiz');
	}
	
	update() {
		if (this.enableAdvance) {
				if (this.allowAdvanceReverse) {
					if (this.addvanceToSpecificScene === true) {
						if (this.keyForward.isDown) {
							this.currentScene = this.sceneToJumpTo;
							this.showScene(this.currentScene);
						}
					} else {
						if (this.keyForward.isDown) {
							this.currentScene += 1;
							this.showScene(this.currentScene);
						}
						if (this.keyBack.isDown) {
							this.currentScene -= 1;
							if (this.currentScene < 1) this.currentScene = 1;
							this.showScene(this.currentScene);
						}
					}
				}
		}
	}

	setupFonts() {

		this.instruxFont =   {
			fontFamily: "Arial",
			fontSize: 28,
			color: "#333",
			fontStyle: "normal",
			wordWrap: { width: 700, useAdvancedWrap: true }
		}
		this.keyHintFont =   {
			fontFamily: "Arial",
			fontSize: 28,
			color: "#fff",
			fontStyle: "normal",
			wordWrap: { width: 700, useAdvancedWrap: true }
		}
		this.instruxFontItalic =  {
			fontFamily: "Arial",
			fontSize: 28,
			color: "#333",
			fontStyle: "italic",
			wordWrap: { width: 700, useAdvancedWrap: true }
		}
	}

	setupKeys() {
		this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.keyBack = this.input.keyboard.addKey('B');
		this.keyForward = this.input.keyboard.addKey('N');
		this.keyD = this.input.keyboard.addKey('D');
	}


	makeTextLarge(y, text) {
		let style = 'normal';
		let textFont = {
			fontFamily: 'Courier',
			fontSize: 24,
			color: '#fff',
			wordWrap:  {   width: 700,  useAdvancedWrap: false }
		};

		return this.add.text(450, y, text, textFont).setOrigin(0.5,0.5);

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

		return this.add.text(this.m, y, text, textFont).setOrigin(origin).setAlign('justify');

	}


	addHeadline(text) {
		return this.add.text(this.m, 90, text, {
			fontFamily: f.instructions.stageTitle.fam, 
			color: f.instructions.stageTitle.color, 
			fontSize: f.instructions.stageTitle.size }).setOrigin(0.5);
	}
	addAdvance() {
		// spacebar button
		this.advance = this.add.text(this.m, 580, 
			'Press N to go to the next screen, B to go back', {  
				fontFamily: f.spaceBarLine.fam, 
				fontSize: f.spaceBarLine.size, 
				color: f.spaceBarLine.color 
		}).setOrigin(0.5).setAlpha(0.1);
		this.delayCall();
	}
	delayCall() {
		this.time.delayedCall(this.instructionAnimationDelay, 
			() => { 
				this.enableAdvance = true; 
				this.advance.setAlpha(1)
				this.allowAdvanceReverse = true;
			}, null, this);
	}
}