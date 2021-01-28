class Quiz extends Phaser.Scene {

    constructor() {
        super({ key: "Quiz" });
        this.quizData = {
            questions: [
                {
                    questionText: 'What is the chance (out of 100) that you will win this lottery?',
                    answerMap: {
                        keyA: '0', keyB: '25', keyC: '50', keyD: '75'
                    },
										correctAnswer: 'D',
										image: 'risk01'
								},
								{
									questionText: 'What is the chance (out of 100) of winning the lottery that this image represents?',
									answerMap: {
											keyA: '0', keyB: '100', keyC: 'Between 25 and 75', keyD: 'Exactly 25'
									},
									correctAnswer: 'C',
									image: 'risk02'
							},
							{
								questionText: 'Suppose this trial was randomly selected for payment, and you chose the option on the LEFT. How many points would you earn?',
								answerMap: {
										keyA: '0', keyB: '5', keyC: '8', keyD: '16'
								},
								correctAnswer: 'B',
								image: 'risk03'
						}
            ]
        }

      

    }

    preload() {
        this.load.image('key-q', '/game_assets/keyQ.png');
        this.load.image('key-w', '/game_assets/keyW.png');
        this.load.image('key-e', '/game_assets/keyE.png');
        this.load.image('key-r', '/game_assets/keyR.png');
        this.load.image('red-cross', '/game_assets/red-cross.png');
				this.load.image('green-check', '/game_assets/green-check.png');

				this.load.image('risk01', '/game_assets/risk-quiz-image-01.jpg');
				this.load.image('risk02', '/game_assets/risk-quiz-image-02.jpg');
				this.load.image('risk03', '/game_assets/risk-quiz-image-03.jpg');

    }




    create() {

        let quizIntroText = 'We will now ask you 3 multiple choice questions to confirm your understanding of the instructions. If you make a mistake, you will be sent back to the first page of the instructions. Press the spacebar to begin';
        
        this.quizMainText = this.add.text(450, 300, quizIntroText,  
            { fontFamily: "Arial", fontSize: 24, color: "#000", wordWrap: {  width: 700, useAdvancedWrap: true }
        }).setOrigin(0.5, 0.5);

        this.questionText = this.add.text(450, 100, '', 
            { fontFamily: "Arial", fontSize: 24, color: "#000", wordWrap: {  width: 700, useAdvancedWrap: true }
        }).setOrigin(0.5, 0.5).setAlpha(0);

        this.spacebarToAdvance = this.add.text(450, 580, 'Press spacebar to continue', 
        {   fontFamily: f.spaceBarLine.fam, 
            fontSize: f.spaceBarLine.size, color: f.spaceBarLine.color }).setOrigin(0.5, 0.5);
            
        this.correctImage = this.add.image(100, 100, 'green-check').setAlpha(0);
        this.incorrectImage = this.add.image(100, 500, 'red-cross').setAlpha(0);



				this.trialIllustration01 = this.add.image(700, 350, 'risk01')
						.setScale(0.4).setOrigin(0.5, 0.5).setAlpha(0);
				this.trialIllustration02 = this.add.image(700, 350, 'risk02')
						.setScale(0.4).setOrigin(0.5, 0.5).setAlpha(0);
				this.trialIllustration03 = this.add.image(500, 350, 'risk03')
						.setScale(0.4).setOrigin(0.5, 0.5).setAlpha(0);

        // shuffle questions
        this.quizData.questions = this.shuffle(this.quizData.questions)

        this.setupKeys();
        this.setupAnswerSprites();
        this.allowInput = true;
        this.currentQuestion = 0;
        this.questionCounter = 0;
        this.maxQuestions = 3;
        this.questionsDone = false;
        this.onIntro = true;
        this.incorrectReceived = false;
        this.gotOneQuestionWrong = false;
    }
    
    update() {
        if (this.allowInput === true) {
            if (this.onIntro === true) {
                if (this.keySpace.isDown === true) {
                    this.allowInput = false; this.onIntro = false;
                    this.startQuestions();
                }
            } else if (this.incorrectReceived === true) {
                if (this.keySpace.isDown === true) {
                    this.allowInput = false;


                    //this.scene.start("InstructionsPart1");
                }
            } else if (this.questionsDone === true) {
                // use has finished questions, now can use space to repeat instrux
                // or N to start game
                if (this.keyB.isDown === true) {
                    this.scene.start("Instructions");

                } else if (this.keyN.isDown === true) {
                    this.scene.start("PracticeIntro");
                }
            } else {
                
                // eval answer and advance
                if (this.keyQ.isDown === true) {
                    this.allowInput = false; 
                    this.evalResponse('A');
                } else if (this.keyW.isDown === true) {
                    this.allowInput = false; 
                    this.evalResponse('B');
                } else if (this.keyE.isDown === true) {
                    this.allowInput = false; 
                    this.evalResponse('C');
                } else if (this.keyR.isDown === true) {
                    this.allowInput = false; 
                    this.evalResponse('D');
                }
                
            }
           
        }
    }

    startQuestions() {
        this.quizMainText.setAlpha(0);

        // get first
        this.currentQuestion = this.quizData.questions[0];
        this.setQuestion(this.currentQuestion);
        this.showChoices(this.currentQuestion);
    }

    setQuestion(question) {

			switch(question.image) {
				case 'risk01':
					this.trialIllustration01.setAlpha(1);
					this.trialIllustration02.setAlpha(0);
					this.trialIllustration03.setAlpha(0);
					break;
				case 'risk02':
					this.trialIllustration01.setAlpha(0);
					this.trialIllustration02.setAlpha(1);
					this.trialIllustration03.setAlpha(0);
					break;
				case 'risk03':
					this.trialIllustration01.setAlpha(0);
					this.trialIllustration02.setAlpha(0);
					this.trialIllustration03.setAlpha(1);
					break;
			}
			this.questionText.setText(question.questionText).setAlpha(1);
			this.spacebarToAdvance.setAlpha(0);
    }

    showChoices(question) {
			this.answerA.setText(question.answerMap.keyA).setAlpha(1);
			this.answerB.setText(question.answerMap.keyB).setAlpha(1);
			this.answerC.setText(question.answerMap.keyC).setAlpha(1);
			this.answerD.setText(question.answerMap.keyD).setAlpha(1);
			this.keySpriteQ.setAlpha(1);
			this.keySpriteW.setAlpha(1);
			this.keySpriteE.setAlpha(1);
			this.keySpriteR.setAlpha(1);
			this.allowInput = true;
			this.trialIllustration = null;
			
    }

    evalResponse(choice) {
        this.allowInput = false;

        let correct = false;
        if (choice === this.currentQuestion.correctAnswer) {
            correct = true;
        } else {
            this.gotOneQuestionWrong = true;
        }
        let chosenSprite = null;
        switch(choice) {
            case 'A': chosenSprite = this.keySpriteQ; break;
            case 'B': chosenSprite = this.keySpriteW; break;
            case 'C': chosenSprite = this.keySpriteE; break;
            case 'D': chosenSprite = this.keySpriteR; break;
        }
        
        // add a little tween here
        this.tweens.add({
            targets: chosenSprite, alpha: 0, ease: 'Linear',       
            duration: 100, repeat: 2, yoyo: true, onComplete: () => { 
                this.flashCorrectorIncorrect(choice, correct);
                
            }
        });

    }

    flashCorrectorIncorrect(choice, correct) {
        let sprite = (correct) ? this.correctImage : this.incorrectImage;
        switch (choice) {
            case 'A': sprite.setPosition(110, 170).setAlpha(1); break;
            case 'B': sprite.setPosition(110, 270).setAlpha(1); break;
            case 'C': sprite.setPosition(110, 370).setAlpha(1); break;
            case 'D': sprite.setPosition(110, 470).setAlpha(1); break;
        }
        this.time.delayedCall(1000, () => { 
            this.evalChoice(correct) }, null, this);
    }


    evalChoice(correct) {
        this.correctImage.setAlpha(0);
        this.incorrectImage.setAlpha(0);

        if (correct === true) {
            this.advanceQuestion();
        } else {
            this.incorrectChoice();
        }
    }

    advanceQuestion() {
        this.allowInput = false;
        this.questionCounter += 1;
        
        if (this.questionCounter === this.maxQuestions) {
            this.endQuiz();
        } else {
            this.time.delayedCall(500, 
                () => { 
                    this.currentQuestion = this.quizData.questions[this.questionCounter];
                    this.setQuestion(this.currentQuestion);
                    this.showChoices(this.currentQuestion);
                }, null, this);
        }
    }
    
    endQuiz() {

			this.trialIllustration01.setAlpha(0);
			this.trialIllustration02.setAlpha(0);
			this.trialIllustration03.setAlpha(0);

        this.hideQuestionAndChoices();
        this.questionsDone = true;
        // figure out if they answered correctly or not
        if (this.gotOneQuestionWrong === false) {
            this.spacebarToAdvance.setAlpha(0);
            this.quizMainText
                .setText('Great! You have answered all of the questions correctly and may now start the game.\n\nYou will get a chance to practice before the game begins.').setAlpha(1);
            this.allowInput = true;
            this.spacebarToAdvance = this.add.text(450, 580, 'Press N to proceed to the practice stage, press B to repeat the instructions', { fontFamily: f.spaceBarLine.fam, 
                fontSize: f.spaceBarLine.size, color: f.spaceBarLine.color }).setOrigin(0.5, 0.5);
        } else {
            // they got one wrong so we make them repeat
            this.spacebarToAdvance.setAlpha(0);
            this.quizMainText
                .setText('You did not answer all of the questions correctly. You will now be redirected to repeat the instructions.').setAlpha(1);
            this.allowInput = false;
            this.time.delayedCall(2000,  () => { 
                this.scene.start("Instructions")}, null, this);
        }
    }


    incorrectChoice() {
        // we show an error and guide the user back to the instructions
        //this.hideQuestionAndChoices();
        this.spacebarToAdvance.setAlpha(0);
        this.allowInput = true;
        this.advanceQuestion();
    }

    hideQuestionAndChoices() {
        this.questionText.setAlpha(0);
        this.answerA.setAlpha(0);
        this.answerB.setAlpha(0);
        this.answerC.setAlpha(0);
        this.answerD.setAlpha(0);
        this.keySpriteQ.setAlpha(0);
        this.keySpriteW.setAlpha(0);
        this.keySpriteE.setAlpha(0);
        this.keySpriteR.setAlpha(0);
    }


    setupAnswerSprites() {
      
        this.answerA = this.add.text(130, 170, '',
            { fontFamily: "Arial", fontSize: 24, color: "#000", wordWrap: {  width: 700, useAdvancedWrap: true }
        }).setOrigin(0, 0.5).setAlpha(0);
        this.keySpriteQ = this.add.image(60, 170, 'key-q').setOrigin(0.5, 0.5).setScale(0.7).setAlpha(0);

        this.answerB = this.add.text(130, 270, '',
            { fontFamily: "Arial", fontSize: 24, color: "#000", wordWrap: {  width: 700, useAdvancedWrap: true }
        }).setOrigin(0, 0.5).setAlpha(0);
        this.keySpriteW = this.add.image(60, 270, 'key-w').setOrigin(0.5, 0.5).setScale(0.7).setAlpha(0);

        this.answerC = this.add.text(130, 370, '',
            { fontFamily: "Arial", fontSize: 24, color: "#000", wordWrap: {  width: 700, useAdvancedWrap: true }
        }).setOrigin(0, 0.5).setAlpha(0);
        this.keySpriteE = this.add.image(60, 370, 'key-e').setOrigin(0.5, 0.5).setScale(0.7).setAlpha(0);
      
        this.answerD = this.add.text(130, 470, '',
            { fontFamily: "Arial", fontSize: 24, color: "#000", wordWrap: {  width: 700, useAdvancedWrap: true }
        }).setOrigin(0, 0.5).setAlpha(0);
        this.keySpriteR = this.add.image(60, 470, 'key-r').setOrigin(0.5, 0.5).setScale(0.7).setAlpha(0);
      
        
    }
    

    setupKeys() {
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q); 
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); 
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); 
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    }


    // shuffle function
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}