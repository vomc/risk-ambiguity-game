class Bonus extends Phaser.Scene {
	
	
	constructor() { 
		super({ key: "Bonus" }); 
		this.promptFont = { fontFamily: "Arial", fontSize: 24, color: "#000", 
			wordWrap: { width: 700, useAdvancedWrap: true }}
	}

	create() {
		this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.userAction = null;
		this.trialMax = null;
		this.trialType = null;
		
		const bonus = this.drawBonus();
		config.gameData.bonusInPoints = bonus;
		
		const statusText = `In this trial you had a choice between a lottery that ranged from 0 to ${this.trialMax} or between 5 points.`;
		this.add.text(450, 150, 'Thank you for playing!\n\nWe have drawn a random trial from the game you just finished.', this.promptFont).setOrigin(0.5, 0.5);
		this.add.text(450, 250, statusText, this.promptFont).setOrigin(0.5, 0.5);
		
		let statusText3 = `You chose to take the lottery. We ran the lottery and you won ${bonus} points.`
		
		if (this.userAction !== 'risk') {
			statusText3 = `You chose not to take the lottery and therefore won ${bonus} points.`
		}

		this.add.text(450, 350, statusText3, this.promptFont).setOrigin(0.5, 0.5);

		const conversionRate = 0.1;
		const dollarsEarned = (bonus * conversionRate).toFixed(2);
		config.gameData.dollarsEarned = dollarsEarned;

		let statusText4 = `Based on our conversion rate, this will result in a payout of $${dollarsEarned} in addition to the base reward for completing the task.`
		
		this.add.text(450, 450, statusText4, this.promptFont).setOrigin(0.5, 0.5);
		this.allowInput = false;
		
		this.time.delayedCall(800, () => {  
			this.addSpacebarToAdvance(); this.allowInput = true;
		}, null, this);
	}

	drawBonus() {
		
		let trialsCompleted = 8;
		
		if (config.gameData.trials !== null) {
			trialsCompleted = config.gameData.trials.length;
		}
		
		let numRandom = Phaser.Math.Between(0, (trialsCompleted-1));

		if (config.gameData.trials !== null) {
			// 1 we find a random trial
			const rndTrial = config.gameData.trials[numRandom];

			// example from testing
			/*
			trialNo: 3
			setupData: {reward: 19, uncertainty: 0.5, type: "risk", winning_color: "red"}
			userChoice: "risk"
			*/

			config.gameData.trialChosenForBonus = rndTrial;
			config.gameData.trialChosenForBonus.trialNo = (numRandom + 1);
			config.gameData.trialChosenForBonus.diceRoll = null;
			config.gameData.trialChosenForBonus.ambiguityLevel = null;
			config.gameData.trialChosenForBonus.ambiguityCertainty = null
			
			this.userAction = rndTrial.userChoice;
			this.trialMax = rndTrial.setupData.reward;
			this.trialType = rndTrial.setupData.type;
			
			
			const reward = rndTrial.setupData.reward;
			
			// 2 - we take the 'trial_uncertainty' value (percent)
			const uncertainty = rndTrial.setupData.uncertainty * 100;
			// setupData: {reward: 19, uncertainty: 0.5, type: "risk", winning_color: "red"}
			// 0.5 => 50
			
			// 3 - 50 / 50% change of what the winning color was (either red or blue)
			
			// was it red?
			const redOnTop = (rndTrial.setupData.winning_color === 'red') ? true : false;
			// make a random dice roll, in the example i rolled a 3
			const diceRollTemp = Phaser.Math.Between(1, 100);
			
			// winning color was red, so the dice roll remains 3
			const diceRoll = (redOnTop === true) ? diceRollTemp : 100 - diceRollTemp;
			// if based on 50/50% chance it was not red, then
			// the dice roll would have been 97 (i.e. 100 - 3)
			// causing the user to player to lose the lottery...
			
			if (rndTrial.userChoice === 'certainty') { 
				return 5;
			} else {
				config.gameData.trialChosenForBonus.diceRoll = diceRoll;
				
				
				// 4 - if we have a risk trial as per the question
				if (rndTrial.setupData.type === 'risk') { 
					
					// 5 - if the random roll < uncertainty: give reward
					return (diceRoll <= uncertainty) ? reward : 0;
				
				
				} else { 
					
					// ambiguity
					// first we need to randomly determine the position of the probability
					// that is hidden by the occluder
					// we do that by determining a minimum which is what the user sees
					
					const uncertaintyMin = (100 - uncertainty) / 2;
					const uncertaintyMax = uncertaintyMin + uncertainty;
					const uncertaintyDrawn = Phaser.Math.Between(uncertaintyMin, uncertaintyMax);
					
					
					
					config.gameData.trialChosenForBonus.ambiguityLevel = uncertaintyDrawn;

					const rewardReturned = (diceRoll <= uncertaintyDrawn) ? reward : 0;
					
					return rewardReturned;
					
				}
			}
			//}
	  
			
	  
		}
	}

	addSpacebarToAdvance() {
		if (this.choiceMessage) this.choiceMessage.destroy();
		let spacebarY = 580;
		let spacebar =  this.add.text(450, spacebarY, 'Please tap the spacebar to continue', {
			fontFamily: "Arial", fontSize: 16, color: "#000000"
		}).setOrigin(0.5, 0.5).setAlpha(1);
		return spacebar;
	}
	
	update() {
		if (this.allowInput === true) {
			if (this.keySpace.isDown) {
				this.scene.start("End");
			}
		}
	}


}
