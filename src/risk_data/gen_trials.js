'use strict'
/**
 * this function generates the trials that are provided to the game
 */
const makeTrials = () => {
	let trials = [];
	const RISK = [0.25, 0.5, 0.75];
	const AMB = [0.24, 0.5, 0.74];
	const REWARD = [5, 6, 7, 8, 10, 12, 14, 16, 19, 23, 27, 31, 37, 44, 52, 61, 73, 86, 101, 120];

	let riskSide = 'left';
	let winningColor = 'red';

	RISK.forEach(risk => {
		REWARD.forEach(rew => {
			let trial = { reward: rew, uncertainty: risk, type: 'risk', winning_color: winningColor }
			trials.push(trial);
			// alternate color and side for each trial
			(riskSide === 'left') ? riskSide = 'right' : riskSide = 'left'
			(winningColor === 'red') ? winningColor = 'blue' : winningColor = 'red'
		})
	})

	AMB.forEach(amb => {
		REWARD.forEach(rew => {
			let trial = { reward: rew, uncertainty: amb, type: 'ambiguity', winning_color: winningColor }
			trials.push(trial);
			(winningColor === 'red') ? winningColor = 'blue' : winningColor = 'red';
		})
	})
	return shuffle(trials);
}

makeTrials();

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

module.exports = { makeTrials }