class Trial extends Phaser.Scene {
	/**
	 * set up color and fonts
	 */
	constructor() {
		super({ key: "Trial" });
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
	// load images
	preload() {
		this.load.image('dot-white', '/game_assets/blank-coin.png');
		this.px = this.load.image('px', '/game_assets/one-white.png');
		this.load.json('trials', '/getTrialData/risk');
	}
	// run once to set up the game
	create() {
		this.trialData = this.cache.json.get('trials'); // load trial data from server

		this.allowInput = false;
		this.botAlreadyShown = false; // bot question

		this.spacebarToAdvance = this.addSpacebarToAdvance();
		this.spacebarToAdvance.setAlpha(0);

		this.storeTurkData(); // set up mTurk data
		this.setupKeys(); // set up the keyboard
		this.prepTrials();

		this.numTrialsLeft = null;
		this.trialCounter = 0;
		this.onBreak = false;
		this.numberOfTrialsPerBlock = 40;
	}
	/**
	 * prepare the trial data, this only removes some trials if we are in a shortGame
	 * used only for testing and not possible to use during actual task on mTurk
	 */
	prepTrials() {
		if (config.shortGame === true) {
			this.trials = { completed: [], toComplete: this.trialData.slice(0, 4) };
		} else {
			this.trials = { completed: [], toComplete: this.trialData };
		}
		this.trialCounter = 0;
		this.setupTrial();
	}

	/**
	 * now that we have trial data, we set up the initial trial
	 */
	setupTrial() {
		this.trialInProgress = true;

		// if continuing from break: remove text
		if (this.breakText) this.breakText.destroy();

		// randomly determine side that contains the 'stack' of colors
		this.trialStackSide = (Phaser.Math.Between(0, 10) >= 5) ? 'left' : 'right';

		// get the current trial data from the list of trials to go through
		this.currentTrial = this.trials.toComplete.shift();
		this.currentTrialData = { setupData: this.currentTrial, userChoice: null, userTiming: null }

		this.beginTrial();
		// allow keyboard input after 1000ms
		this.time.delayedCall(1000, () => { this.allowInput = true; }, null, this);
	}
	/**
	 * remove spacebar input
	 */
	beginTrial() {
		if (this.spacebarToAdvance) this.spacebarToAdvance.destroy();
		this.drawTrial();
	}

	/**
	 * now we draw the trial 'stack'
	 */
	drawTrial() {
		// we are drawing two stacks, one on each side using X and Y coordinates from the top left corner
		// i.e. this.add.image(x, y)
		this.sideChosenLeft = this.add.image(0, 0, 'px').setTint(this.tints.blue).setOrigin(0, 0).setDisplaySize(450, 600).setAlpha(0);
		this.sideChosenRight = this.add.image(450, 0, 'px').setTint(this.tints.blue).setOrigin(0, 0).setDisplaySize(450, 600).setAlpha(0);

		// add the certain value and the reward value
		// if the 'risk' stack is on the left, then we render the certain option (i.e. 5 points) to the right, otherwise flip
		if (this.trialStackSide === 'left') {
			this.certainOption = this.add.text(675, 300, '5', this.valueFont).setOrigin(0.5, 0.5);
			// we always draw the bars and then also the 'amounts' which are the rewards
			this.drawBars('left');
			this.drawAmounts('left');
		} else {
			this.certainOption = this.add.text(225, 300, '5', this.valueFont).setOrigin(0.5, 0.5);
			this.drawBars('right');
			this.drawAmounts('right');
		}
	}

	/**
	 * this is a utility function that handles drawing the bars on a given side
	 */
	drawBars(side) {
		// set up constants for positioning
		const leftCenterX = 320;
		const rightCenterX = 770;
		const barWidth = 200;

		// set up vars for the bar sizing
		let startYTop = 100;
		let startYBottom = 300;
		let barHeightTop = 200;
		let barHeightBottom = 200;

		// based on the level of uncertainty in the trial we adjust the size of the bars
		barHeightTop = this.convertSize(this.currentTrial.uncertainty);
		barHeightBottom = this.convertSize(1 - this.currentTrial.uncertainty);
		startYBottom = startYTop + barHeightTop;

		// prepare a stack that we render on the screen
		this.trialStack = [];

		// if we have a risk trial we draw the regular color blocks
		if (this.currentTrial.type === 'risk') {
			let stackTop, stackBottom;

			if (side === 'left') {
				stackTop = this.add.image(leftCenterX, startYTop, 'px')
					.setDisplaySize(barWidth, barHeightTop)
					.setOrigin(0.5, 0);
				stackBottom = this.add.image(leftCenterX, startYBottom, 'px')
					.setDisplaySize(barWidth, barHeightBottom)
					.setOrigin(0.5, 0);
			} else  { // right side
				stackTop = this.add.image(rightCenterX, startYTop, 'px')
					.setDisplaySize(barWidth, barHeightTop)
					.setOrigin(0.5, 0);
				stackBottom = this.add.image(rightCenterX, startYBottom, 'px')
					.setDisplaySize(barWidth, barHeightBottom)
					.setOrigin(0.5, 0);
			}

			// color in red and blue
			stackTop.setTint(this.tints.red);
			stackBottom.setTint(this.tints.blue);

			// get the numbers based on the type of trial and side (see below)
			const numberTop = this.makeNumber(side, this.currentTrial.type, true);
			const numberBottom = this.makeNumber(side, this.currentTrial.type, false);
			// add these components into the stack for rendering
			this.trialStack.push(stackTop, stackBottom, numberTop, numberBottom);
		} else if (this.currentTrial.type === 'ambiguity') {
			// on an ambiguity trial, we also need to draw the occluder, see below
			this.drawAmbiguityStack(side);
		}
	}

	/**
	 * based on the degree of uncertainty we get various number values
	 * and render them
	 */
	makeNumber(side, trialType, top) {
		let numberX = 220;
		let numberY = 150;
		let numValues = this.getNumberValues(); // see below

		let numValue = numValues.top;
		// set up positions
		if (top === false) { numberY = 450; numValue = numValues.bottom; }
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
		} else { // ambiguity trials
			switch (this.currentTrial.uncertainty) {
				case 0.24: 	return { top: 38, bottom: 38};
				case 0.5: 	return { top: 25, bottom: 25};
				case 0.74:  return { top: 13, bottom: 13};
			}
		}
	}

	/**
	 * helper function to properly align the uncertainty values displayed
	 */
	getNumberYAlignment(trialType) {
		switch(this.currentTrial.uncertainty) {
			case 0.24: 	return { top: 170, bottom: 430};
			case 0.25: 	return { top: 150, bottom: 350};
			case 0.5: 	return (trialType === 'risk') ? { top: 200, bottom: 400} : { top: 150, bottom: 452};
			case 0.74:  return { top: 125, bottom: 475};
			case 0.75:  return { top: 250, bottom: 452};
		}
	}

	/**
	 * largely the same drawing logic
	 * except we also add an occluder here
	 */
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

		let occluder = this.addOccluder(side);

		const numberTop = this.makeNumber(side, this.currentTrial.type, true);
		const numberBottom = this.makeNumber(side, this.currentTrial.type, false);
		this.trialStack.push(stackTop, stackBottom, numberTop, numberBottom, occluder);
	}

	addOccluder(side) {
		let occluder;
		let occluderX = 770;
		if (side === 'left') occluderX = 320;

		// size the occluder based on the level of uncertainty
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

	/**
	 * render the amounts of the reward
	 */
	drawAmounts(side) {
		const leftCenterX = 220;
		const rightCenterX = 670;

		const rewardAmount = this.currentTrial.reward;
		const winningSide = this.currentTrial.winning_color;
		this.amountWin = this.add.text((side === 'left') ? leftCenterX : rightCenterX, (winningSide === 'red') ? 50 : 550, `${rewardAmount}`, this.valueFont);
		this.amountLose = this.add.text((side === 'left') ? leftCenterX : rightCenterX, (winningSide === 'blue') ? 50 : 550, '0', this.valueFont);

		this.amountWin.setOrigin(0.5, 0.5);
		this.amountLose.setOrigin(0.5, 0.5);

		// prevent user from doing anything here
		this.allowInput = false;

		// we start a timer as soon as these are drawn
		this.decisionTimer = this.time.addEvent({ delay: 3000000, callback: this.trialWaitTimeOut, callbackScope: this });

		// remove spacebar
		if (this.spacebarToAdvance) this.spacebarToAdvance.destroy();

		// after 500ms, show a message instructing user to make a choice
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

	// empty function called if user times out as there
	trialWaitTimeOut() { }

	// util function to handle sizing bars to the screen
	convertSize(size) { const maxPx = 400; return size * maxPx; }

	// remove graphics during bot question
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

	/**
	 * handle the choice that customer makes
	 */
	processChoice(side) {
		if (this.choiceMessage) this.choiceMessage.destroy();

		// store how long it took in milliseconds
		const timeElapsed = this.decisionTimer.elapsed;
		this.currentTrialData.userTiming = timeElapsed;
		// destroy the timer
		this.decisionTimer.destroy();
		this.userChoice = side;
		// user chose 'risk'
		this.currentTrialData.userChoice = 'risk';
		// unless the side chosen (side) is not the side
		// corresponding to 'certainty' in the trial data
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
		this.time.delayedCall(1000, () => {
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

	resumeTrials() {
		if (this.breakText) this.breakText.destroy();
		this.onBreak = false;
		this.setupTrial()
	}

	nextTrial() {
		if (this.breakText) this.breakText.destroy();
		let numberOfTrials = this.numberOfTrialsPerBlock;
		if (config.shortGame === true) numberOfTrials = 1;
		const timeElapsed = this.waitToAdvanceTimer.elapsed;
		this.currentTrialData.userTimeWaitingToAdvance= timeElapsed;
		this.waitToAdvanceTimer.destroy();
		this.saveCurrentTrial();
		this.trialCounter += 1;

		if ((this.trialCounter % numberOfTrials === 0) && (this.trials.toComplete.length > 0)) {
			this.showBreakScreen(this.trials.toComplete.length);
		} else {
			if (this.trials.toComplete.length > 0) {
				this.setupTrial();
			} else {
				this.endTrials();
			}
		}
	}

	/**
	 * break between trials
	 * now we show a bot question
	 */
	showBreakScreen() {
		this.allowInput = false;
		this.destroyGraphics();
		this.showBotQuestion();
	}

	// resume after break
	resumeBreak() {
		const numTrialsLeft = this.trials.toComplete.length;
		let breakTextLine = `You have completed one block of trials.\n\nThere are a total of three blocks in the game. You may now take a break if you would like.\n\n\nThere are ${numTrialsLeft} trials left`;
		this.breakText = this.add.text(450, 300, breakTextLine, this.promptFont)
			.setOrigin(0.5, 0.5);
		this.onBreak = true;
		this.allowInput = false;
		this.time.delayedCall(1000, () => {
			this.allowInput = true;
			this.spacebarToAdvance = this.addSpacebarToAdvance();
		}, null, this);
	}

	// bot question related
	botDetected = () => this.scene.start('BotDetected');

	// show a question
	showBotQuestion() {
		config.gameData.trials = this.trials.completed;
		this.botActive = true;
		Bot.setContext(this);
		this.botQuestion = Bot.drawQuestion();
		this.botHints = Bot.drawHints();
		this.botFailMessage = null;
		this.botAnswerBox = Bot.drawAnswerBox();
		this.botResponseText = Bot.addAnswerText();
		if (this.botAlreadyShown === false) this.processBotInput();
	}

	// process the provided answer
	processBotInput() {
		const answerPassed = this.answerPassed;
		const answerFailed = this.answerFailed;
		let charCounter = 0;
		let lastKeyDown = null;
		this.input.keyboard.on('keydown', (e) => lastKeyDown = e.keyCode);
		this.input.keyboard.on('keyup', (e) => {
			if (this.botActive === true) {
			let lastKeyUp = e.keyCode;
			if (lastKeyDown == lastKeyDown) {
				if (lastKeyUp === 8) { // BACKSPACE
					let botTextSoFar = this.botResponseText.text;
					this.botResponseText.setText(botTextSoFar.slice(0, -1));
				} else if (lastKeyUp === 13) { //ENTER
					const answer = this.botResponseText.text;
					(Bot.processAnswer(answer) === true)
						? answerPassed() : answerFailed();
				} else {	 // add
					if ((lastKeyUp === 32) ||
						((lastKeyUp > 47) && (lastKeyUp < 91))) {
						let botTextSoFar = this.botResponseText.text;
						botTextSoFar += e.key
						charCounter += 1;
						if (charCounter > 50) { botTextSoFar += '\n'; charCounter = 0; }
						this.botResponseText.setText(botTextSoFar);
						}
					}
				}
			}
		});
	}

	// if answer passed: resume
	answerPassed = () => {
		this.botActive = false;
		this.botAlreadyShown = true;
		this.destroyBotGraphics();
		this.resumeBreak();
	}

	// if answer failed: stop the game and show the 'bot detected' warning
	answerFailed = () => {
		if (this.botFailMessage !== null) this.botFailMessage.destroy();
		Bot.addAttempt();
		this.botFailMessage = Bot.showFail();
		if (Bot.botDetected === true) this.botDetected();
	}

	// destroy all bot graphics on resume
	destroyBotGraphics = () => {
		if (this.botQuestion) this.botQuestion.destroy();
		if (this.botHints) this.botHints.destroy();
		if (this.botAnswerBox) this.botAnswerBox.destroy();
		if (this.botResponseText) this.botResponseText.destroy();
		if (this.botFailMessage) this.botFailMessage.destroy();
	}

	// once trial is complete: save it
	saveCurrentTrial = () => {
		this.trials.completed.push(this.currentTrialData);
	}

	haveTrialLeft = () => (this.trials.toComplete.length > 0) ? true : false;

	// once all trials are done: start the 'bonus' scene
	endTrials() {
		config.gameData.trials = this.trials.completed;
		this.scene.start("Bonus");
	}

	// the game rendering loop, this runs constantly
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
						this.destroyGraphics();
						(this.trials.toComplete.length > 0)
						? this.resumeTrials()
						: this.endTrials()
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

	// store turk data
	storeTurkData() {
		let uniqueId = document.getElementById('hiddenDataForm').value;
		let workerId = document.getElementById('workerId').value;
		let hitId = document.getElementById('hitId').value;
		let assignmentId = document.getElementById('assignmentId').value;
		config.gameData.turkData = { workerId: workerId, uniqueId: uniqueId, assignmentId: assignmentId, hitId: hitId };
	}

	showMakeChoiceMessage() {
		if (this.spacebarToAdvance) this.spacebarToAdvance.destroy();
		if (this.spacebar) this.spacebar.setAlpha(0)
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

	reenableInput() {
		this.time.delayedCall(this.delayAfterAction, () => { this.allowInput = true }, null, this);
	}

}
