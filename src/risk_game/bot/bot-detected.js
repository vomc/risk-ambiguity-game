class BotDetected extends Phaser.Scene {
	
	
	constructor() { super({ key: "BotDetected" }); }

	create() {



		const recoveryParams = {
			turkData: this.getTurkData(),
			gameKey: config.gameKey			
		}
		
		document.getElementById("statusMessage").innerHTML = `Processing bot, please wait ...`
			
			let text = this.add.text(450, 300, 'You have answered the same question incorrectly three times in a row so the system is marking your account as a bot.\n\n\n\nYou will not receive a reward for playing this game.\n\n\nFor questions or concerns please click the link that will appear below this screen in a few seconds.', 
			{ fontFamily: "Arial",  fontSize: 28,  color: '#000',
				wordWrap: { width: 700, useAdvancedWrap: true }
			});
			text.setOrigin(0.5);


			this.processBotLogic()
				.then(() => {
					const hostname = 'https://warm-tundra-42715.herokuapp.com'
		
					const data = encodeURIComponent(JSON.stringify(recoveryParams))
					
					
					
					document.getElementById("statusMessage").innerHTML = `<a href="${hostname}/unflagging/register-request?data=${data}">Click here if you feel that you have been flagged in error</a>`

				})

			// what then?

	}

	getTurkData() {
		const { gameKey } = config;
		switch (gameKey) {
			case '2lot': return config.trialData.turkData;
			case 'risk': return config.gameData.turkData;
			case 'card': return config.gameData.turkData;
			case 'horizon': return config.trialData.turkData;
			case 'chip': return config.gameData.turkData;
			case 'bayes': return config.gameData.turkDatal;
			case 'questionnaires': return config.turkData;
			case 'averaging': return config.turkData;
			case 'urn': return config.trialData.turkData;
			case 'squares': return config.gameData.turkData;

			default: console.debug("cant extract turk data in bot-detected for ", gameKey);
		}


	}

	processBotLogic() {
		return new Promise((resolve, reject) => {
		config.bot = true;
		const data = {
			bot: true,
			turkData: this.getTurkData(),
			config: config
		}

		const botData = JSON.stringify(data);

		fetch('/bot', {
			
			method: 'post',
			body: botData,
			headers:{ 'Content-Type': 'application/json' }



			}).then(function(response) {
					// partial data save handled server-side
					resolve(response.status)
			}).catch((e) => {
					console.debug("Error saving data", e);
					// now what?
			})
	
})
	}
}