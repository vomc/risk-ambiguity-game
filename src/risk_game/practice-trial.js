class PracticeTrial extends Phaser.Scene {

	constructor() {
		super({ key: "PracticeTrial" });
		this.spacebarAlphaDisabled = 0;
		this.tints = { red: 0xff0000, blue: 0x0000ff, grey: 0xcccccc, black: 0x000000,
		occluderGrey: 0x666666
		 };
		this.valueFont = { fontFamily: "Arial", fontSize: 40, color: "#fff" }
		this.numberFont = { fontFamily: "Arial", fontSize: 24, color: "#fff" }
		this.promptFont = { fontFamily: "Arial", fontSize: 24, color: "#000", 
			wordWrap: { width: 700, useAdvancedWrap: true }
		}
		this.errorFont = { fontFamily: "Arial", fontSize: 18, color: "#aa0000" }
	}

	preload() {
		this.load.image('dot-white', '/game_assets/blank-coin.png');
		this.px = this.load.image('px', '/game_assets/one-white.png');
		this.load.json('practice-trials', '/getTrialData/risk');
	}

	create() {
		this.trialData = this.cache.json.get('practice-trials');
		this.spacebarToAdvance = this.addSpacebarToAdvance();
		this.spacebarToAdvance.setAlpha(0);
		
		this.allowInput = false;
		this.setupKeys();
		this.prepTrials();
		
		this.trialCounter = 0;
		this.onBreak = false;
		this.numberOfTrialsPerBlock = 40;
	}
	
	prepTrials() {
		this.trials = { 
			completed: [], toComplete: this.trialData.slice(0, 3)
		};	
		this.trialCounter = 0;
		this.setupTrial();
	}

	setupTrial() {
		this.trialStackSide = (Phaser.Math.Between(0, 10) >= 5) ? 'left' : 'right';
		this.trialInProgress = true;
		this.currentTrial = this.trials.toComplete.shift();
		this.currentTrialData = {
			setupData: this.currentTrial,
			userChoice: null,
			userTiming: null
		}
		this.beginTrial();
		this.time.delayedCall(500,
			() => { this.allowInput = true; }, null, this);
	}

	beginTrial() {
		if (this.spacebarToAdvance) this.spacebarToAdvance.destroy();
		this.drawTrial(); 
	}

	drawTrial() {
		this.sideChosenLeft = this.add.image(0, 0, 'px')
			.setTint(this.tints.blue)
			.setOrigin(0, 0)
			.setDisplaySize(450, 600)
			.setAlpha(0);
		
		this.sideChosenRight = this.add.image(450, 0, 'px').setTint(this.tints.blue).setOrigin(0, 0).setDisplaySize(450, 600).setAlpha(0);

		if (this.trialStackSide === 'left') {
			this.certainOption = this.add.text(675, 300, '5', this.valueFont).setOrigin(0.5, 0.5);
			this.drawBars('left');
			this.drawAmounts('left');
		} else {
			this.certainOption = this.add.text(225, 300, '5', this.valueFont).setOrigin(0.5, 0.5);
			this.drawBars('right');
			this.drawAmounts('right');
		}
	}
	drawBars(side) {
		const leftCenterX = 320;
		const rightCenterX = 770;
		const barWidth = 200;
		let startYTop = 100;
		let startYBottom = 300;
		let barHeightTop = 200;
		let barHeightBottom = 200;

		barHeightTop = this.convertSize(this.currentTrial.uncertainty);
		barHeightBottom = this.convertSize(1 - this.currentTrial.uncertainty);
		startYBottom = startYTop + barHeightTop;

		this.trialStack = [];
		if (this.currentTrial.type === 'risk'){
			let stackTop, stackBottom;
			
			if (side === 'left') {
				stackTop = this.add.image(leftCenterX, startYTop, 'px')
					.setDisplaySize(barWidth, barHeightTop)
					.setOrigin(0.5, 0);
				stackBottom = this.add.image(leftCenterX, startYBottom, 'px')
					.setDisplaySize(barWidth, barHeightBottom)	
					.setOrigin(0.5, 0);
			} else  {
				stackTop = this.add.image(rightCenterX, startYTop, 'px')
					.setDisplaySize(barWidth, barHeightTop)
					.setOrigin(0.5, 0);
				stackBottom = this.add.image(rightCenterX, startYBottom, 'px')
					.setDisplaySize(barWidth, barHeightBottom)	
					.setOrigin(0.5, 0);
			}

			stackTop.setTint(this.tints.red);
			stackBottom.setTint(this.tints.blue);
			
			const numberTop = this.makeNumber(side,
				this.currentTrial.type, true);
			const numberBottom = this.makeNumber(side,
				this.currentTrial.type, false);

			this.trialStack.push(stackTop, stackBottom, numberTop, numberBottom);
		} else if (this.currentTrial.type === 'ambiguity') {
			this.drawAmbiguityStack(side);
		}
	}
	makeNumber(side, trialType, top) {
		let numberX = 220;
		let numberY = 150;
		let numValues = this.getNumberValues();
		
		let numValue = numValues.top;
		if (top === false) {
			numberY = 450;
			numValue = numValues.bottom;
		}
		
		if (side === 'right') numberX = 672;

		
		numberY = this.getNumberYAlignment(trialType);
		
		return this.add.text(numberX, (top === true) ? numberY.top : numberY.bottom, numValue, this.numberFont)
			.setOrigin(0.5, 0.5);
	}
	getNumberValues() {
		if (this.currentTrial.type === 'risk') {
			switch (this.currentTrial.uncertainty) {
				case 0.25: 	return { top: 25, bottom: 75};
				case 0.5: 	return { top: 50, bottom: 50};
				case 0.75:  return { top: 75, bottom: 25};
			}
		} else {
			// amb trials
			switch (this.currentTrial.uncertainty) {
				case 0.24: 	return { top: 38, bottom: 38};
				case 0.5: 	return { top: 25, bottom: 25};
				case 0.74:  return { top: 13, bottom: 13};
			}

		}
			
	}
	getNumberYAlignment(trialType) {
		switch(this.currentTrial.uncertainty) {
			case 0.24: 	return { top: 170, bottom: 430};
			case 0.25: 	return { top: 150, bottom: 350};
			case 0.5: 	return (trialType === 'risk') ? { top: 200, bottom: 400} : { top: 150, bottom: 452};
			case 0.74:  return { top: 125, bottom: 475};
			case 0.75:  return { top: 250, bottom: 452};
		}
	}
	drawAmbiguityStack(side) {
		
		const leftCenterX = 320;
		const rightCenterX = 770;
		const barWidth = 200;

		let startYTop = 100;
		let startYBottom = 300;
		let barHeightTop = 200;
		let barHeightBottom = 200;

		barHeightTop = 200;
		barHeightBottom = 200;
		startYBottom = startYTop + barHeightTop;
		this.trialStack = [];
		let stackTop, stackBottom;
		if (side === 'left') {
		
				stackTop = this.add.image(leftCenterX, startYTop, 'px')
					.setDisplaySize(barWidth, barHeightTop)
					.setOrigin(0.5, 0);

				stackBottom = this.add.image(leftCenterX, startYBottom, 'px')
					.setDisplaySize(barWidth, barHeightBottom)	
					.setOrigin(0.5, 0);
					
		} else {
				stackTop = this.add.image(rightCenterX, startYTop, 'px')
					.setDisplaySize(barWidth, barHeightTop)
					.setOrigin(0.5, 0);
				stackBottom = this.add.image(rightCenterX, startYBottom, 'px')
				.setDisplaySize(barWidth, barHeightBottom)	
				.setOrigin(0.5, 0);
				
		}


		stackTop.setTint(this.tints.red);
		stackBottom.setTint(this.tints.blue);
		
		/*if (this.currentTrial.color_on_top === 'blue') {
			stackTop.setTint(this.tints.blue);
			stackBottom.setTint(this.tints.red);
		} 
		*/
		
		let occluder = this.addOccluder(side);
		
		
		const numberTop = this.makeNumber(side,
			this.currentTrial.type, true);
		const numberBottom = this.makeNumber(side,
			this.currentTrial.type, false);

		this.trialStack.push(stackTop, stackBottom, numberTop, numberBottom, occluder);
	
		

	}
	addOccluder(side) {
		
		let occluder;

		let occluderX = 770;
		if (side === 'left') occluderX = 320;
		
		switch (this.currentTrial.uncertainty) {
			case 0.24:
					occluder = this.add.image(occluderX, 348, 'px')
					.setDisplaySize(200, 96).setOrigin(0.5, 0.5).setTint(this.tints.occluderGrey);
				break;
			case 0.5:
					occluder = this.add.image(occluderX, 400, 'px')
					.setDisplaySize(200, 200).setOrigin(0.5, 0.5).setTint(this.tints.occluderGrey);

				break;
		
			case 0.74:
					occluder = this.add.image(occluderX, 446, 'px')
					.setDisplaySize(200, 296).setOrigin(0.5, 0.5).setTint(this.tints.occluderGrey);
			
				break;
		}
		return occluder;

	}
	drawAmounts(side) {
		const leftCenterX = 220;
		const rightCenterX = 670;
		
		const rewardAmount = this.currentTrial.reward;
		const winningSide = this.currentTrial.winning_color;
		this.amountWin = this.add.text((side === 'left') ? leftCenterX : rightCenterX, (winningSide === 'red') ? 50 : 550, `${rewardAmount}`, this.valueFont);
		this.amountLose = this.add.text((side === 'left') ? leftCenterX : rightCenterX, (winningSide === 'blue') ? 50 : 550, '0', this.valueFont);

		this.amountWin.setOrigin(0.5, 0.5);
		this.amountLose.setOrigin(0.5, 0.5);


		this.allowInput = false;
		this.decisionTimer = this.time.addEvent(
			{ delay: 3000000, callback: this.trialWaitTimeOut, callbackScope: this });
		
		if (this.spacebarToAdvance) this.spacebarToAdvance.destroy();
		
		this.time.delayedCall(500, () => { 
			
			this.choiceMessage = this.showMakeChoiceMessage();
			this.tweens.add({
				targets: this.choiceMessage, alpha: 1, ease: 'Linear',
				duration: 500, repeat: 0, yoyo: false, onComplete: () => {
					this.allowInput = true;
					if (this.spacebarToAdvance) this.spacebarToAdvance.destroy();
			}})
		}, null, this);

	}
	trialWaitTimeOut() {}
	
	convertSize(size) { const maxPx = 400; return size * maxPx; }
	
	destroyGraphics() {
		if (this.certainOption) this.certainOption.destroy();
		if (this.trialStack) this.trialStack.forEach(item => item.destroy());
		if (this.occluder) this.occluder.destroy();
		if (this.amountLose) this.amountLose.destroy();
		if (this.amountWin) this.amountWin.destroy();
		if (this.spacebarToAdvance) this.spacebarToAdvance.destroy();
		if (this.choiceMessage) this.choiceMessage.destroy();
		this.hideChoiceSprites();
	}
	processChoice(side) {
		
		if (this.choiceMessage) this.choiceMessage.destroy();
		const timeElapsed = this.decisionTimer.elapsed;
		this.currentTrialData.userTiming = timeElapsed;
		this.decisionTimer.destroy();
		
		this.userChoice = side;
		

		this.currentTrialData.userChoice = 'risk';
		if (side !== this.trialStackSide) {
			this.currentTrialData.userChoice = 'certainty';
		}
		this.showChoiceSprite(side);
	}
	showChoiceSprite(side) {
		if (this.choiceMessage) this.choiceMessage.destroy();
		
		
		this.allowInput = false;
		this.trialInProgress = false;
		(side === 'right') ? this.sideChosenRight.setAlpha(0.1) : this.sideChosenLeft.setAlpha(0.1)
		this.time.delayedCall(500, () => { 
			this.allowInput = true;
			this.spacebarToAdvance = this.addSpacebarToAdvance();
			this.waitToAdvanceTimer = this.time.addEvent(
				{ delay: 3000000, callback: this.trialWaitTimeOut, callbackScope: this });
		}, null, this);
	}
	hideChoiceSprites() {
		if (this.sideChosenLeft) this.sideChosenLeft.setAlpha(0);
		if (this.sideChosenRight) this.sideChosenRight.setAlpha(0);
	}
	nextTrial() {
		let numberOfTrials = this.numberOfTrialsPerBlock;
		if (config.shortGame === true) numberOfTrials = 1;
		
		this.trialCounter += 1;
		const timeElapsed = this.waitToAdvanceTimer.elapsed;
		this.currentTrialData.userTimeWaitingToAdvance= timeElapsed;
		this.waitToAdvanceTimer.destroy();
		this.saveCurrentTrial();
		
		(this.trials.toComplete.length > 0) 
			? this.setupTrial() 
			: this.endTrials()
		
	}
	showBreakScreen(numTrialsLeft) {
		this.destroyGraphics();

		let breakTextLine = `You have completed one block of trials.\n\nThere are a total of three blocks in the game. You may now take a break if you would like.\n\n\nThere are ${numTrialsLeft} trials left`;

		this.breakText = this.add.text(450, 300, breakTextLine, this.promptFont)
			.setOrigin(0.5, 0.5);
		this.onBreak = true;
		
		
		this.allowInput = false;
		this.time.delayedCall(1000, () => { 
			this.allowInput = true; this.spacebarToAdvance = this.addSpacebarToAdvance();
		}, null, this);


	}
	resumeBreak() {
		
		if (this.breakText) this.breakText.destroy();
		this.destroyGraphics();
		//this.showBotQuestion();
		(this.trials.toComplete.length > 0) ? this.setupTrial() : this.endTrials()
	}
	
	saveCurrentTrial = () => this.trials.completed.push(this.currentTrialData);
	haveTrialLeft = () => (this.trials.toComplete.length > 0) ? true : false;
	endTrials() {
		this.scene.start("PracticeEnd");
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


	update() {
		if (this.allowInput === true) {

			if (this.trialInProgress === true) {
				if (this.keyLeft.isDown === true) {
					this.allowInput = false;
					this.processChoice('left');
				} else if (this.keyRight.isDown === true) {
					this.allowInput = false;
					this.processChoice('right');
				}

			} else {

				if (this.onBreak === true) {
					if (this.keySpace.isDown === true) {
						this.allowInput = false;
						this.onBreak = false;
						this.resumeBreak();
					}	
				} else {
					if (this.keySpace.isDown === true) {
						this.allowInput = false;
						this.destroyGraphics();
						this.nextTrial();
					}
				}

				
			}

			

		}
		
	}

	

	showMakeChoiceMessage() {
		if (this.spacebarToAdvance) this.spacebarToAdvance.destroy();
		let choiceY = 580;
		return this.add.text(450, choiceY, 'Please use the arrow keys to make a selection', {
			fontFamily: "Arial", fontSize: 16, color: "#000000"
		}).setOrigin(0.5, 0.5).setAlpha(0);
	}

	addSpacebarToAdvance() {
		if (this.choiceMessage) this.choiceMessage.destroy();
		let spacebarY = 580;
		let spacebar =  this.add.text(450, spacebarY, 'Please tap the spacebar to continue', {
			fontFamily: "Arial", fontSize: 16, color: "#000000"
		}).setOrigin(0.5, 0.5).setAlpha(1);
		return spacebar;
	}
	setupKeys() {
		// inputs
		this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); 
		this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); 
		this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J); 
		this.keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K); 
		this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
	}
	reenableInput() { this.time.delayedCall(this.delayAfterAction, () => { this.allowInput = true }, null, this); }
	

}
