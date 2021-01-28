class End extends Phaser.Scene {

	constructor() {
			super({ key: "End" });
	}

	create() {
			let endText = 'Thank you for playing!\n\nThe game is now saving your progress.'
			this.trialOutComeStatus = this.add.text(450, 300, endText,  
					{ fontFamily: "Arial", fontSize: 24, color: "#666", wordWrap: {  width: 700, useAdvancedWrap: true }
			}).setOrigin(0.5, 0.5);
	
			let finishText = 'Done. Please click the Submit Assignment button below to receive your reward.'
			this.finishMessage = this.add.text(450, 500, finishText,  
					{ fontFamily: "Arial", fontSize: 24, color: "#666", wordWrap: {  width: 700, useAdvancedWrap: true }
			}).setOrigin(0.5, 0.5).setAlpha(0);

			this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
			this.postResults().then(() => this.completeGame());
	}   
	
	postResults() {
			return new Promise((resolve, reject) => {
				
				let stringifiedData = JSON.stringify(config.gameData);
				
					
					
					fetch('/receiveData/risk', {
							method: 'post',
							body: stringifiedData,
							headers:{
									'Content-Type': 'application/json'
									}
							}).then(function(response) {
									if (response.status === 200) {
											resolve();
									}
							}).catch((e) => {
									
									reject(new Error("could not save data", response));
							});
							

	
			});

	}

	completeGame() {
			
			
			this.tweens.add({
					targets: this.finishMessage, alpha: 1, ease: 'Linear',       
					duration: 500, repeat: 0, yoyo: false, onComplete: () => {
							
							document.getElementById("statusMessage").textContent = "Finished";
							document.getElementById("submitResults").disabled = false;
							document.getElementById("submitResults").style.opacity = 1;
					}
			});
			

			

	}

}