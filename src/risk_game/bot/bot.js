const Bot = {};
// how is this shared? must be the problem with double drawing
let bot_context = null;

Bot.attemptsCurrentQuestion = 0;
Bot.maxAttempts = 3;
Bot.botDetected = false;
Bot.currentQuestion = null;
Bot.threshold = 0.51;
Bot.answerBoxY = 400;


Bot.drawHints = font => {

  let hintText = `${Bot.currentQuestion.hintLine}

  ${Bot.currentQuestion.hints}

  Use the ENTER key when done. Use BACKSPACE to erase
  `
  return bot_context.add.text(100, 200, 
		hintText, Bot.getFont(font)).setAlpha(0.5);
}
	
Bot.drawQuestion = newQuestion => {
  Bot.getQuestion();
  Bot.attemptsCurrentQuestion = 0;
	return bot_context.add.text( 100, 120, Bot.currentQuestion.question, Bot.getFont());
};

Bot.drawAnswerBox = () => bot_context.add.image(100, Bot.answerBoxY, "px")
    .setDisplaySize(-600, -100).setOrigin(1, 1).setAlpha(0.2);

    Bot.addAnswerText = () => bot_context.add.text(110, Bot.answerBoxY, "", Bot.getFont());

/** failures and attempts  */
Bot.addAttempt = () => {
  Bot.attemptsCurrentQuestion += 1;
	if (Bot.attemptsCurrentQuestion === Bot.maxAttempts) Bot.botDetected = true;
};

Bot.processAnswer = answer => (answer.trim().toLowerCase() === Bot.currentQuestion.answer) 
? true : Bot.performFuzzyMatch(answer);

Bot.showFail = () => {
  const attempts = Bot.maxAttempts - Bot.attemptsCurrentQuestion;
  return bot_context.add.text(100, 50,
    `Incorrect! Please use the backspace key to erase your previous answer and try again.\nYou have ${attempts} attempts remaining`, Bot.getErrorFont());
};

/** answer matching  */
Bot.performFuzzyMatch = answer => {
  const realAnswer = Bot.currentQuestion.answer;
	const numChars = answer.length;
	let numMatch = 0;
  let numMismatch = 0;
  let numExtraProvided = 0;

  for (let c = 0; c < numChars; c++) {
    let charA = answer[c];
    let charR = realAnswer[c];
    
    if (charA === charR) {
      numMatch += 1;
    } else {
      if (charR === undefined) { // we have longer input than a response...
        numExtraProvided += 1;
      } else { // not undefined, just a mismatch
        numMismatch += 1;
      }
    }
  }
	//console.debug("miss", numMismatch, "match", numMatch, "extra", numExtraProvided );
	
  const percentMatch = numMatch / numChars;
  const percentMismatch = numMismatch / numChars;
  const percentExtra = numExtraProvided / numChars;
	
	//console.debug( "pm", percentMatch, "perc_mis", percentMismatch, "perextra", percentExtra);
	return percentMatch > this.threshold ? true : false;
};


/** question data  */
Bot.getQuestion = () => {
  
  const availableQuestions = Bot.questions.filter(item => item.shown === false);
  
  let rnd = (Bot.rndIntOne(availableQuestions.length) - 1);
  const question = availableQuestions[rnd];
  question.shown = true;
  Bot.currentQuestion = question;
};

Bot.questions = [
  {
    question: "What color is the sky on a summer day?",
    answer: "blue",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:",
    hints: ["purple, blue, red, pink, yellow, brown, teal, ochre, white, black"]
  },

  {
    question: "What is the color of grass in the summer?",
    answer: "green",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:",
    hints: [ "red, black, teal, green, magenta, cyan, white, pink, purple, blue" ]
  },

  {
    question: "What do we use to type on a computer?",
    answer: "hands",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:",
    hints: ["feet, neck, legs, hair, hands, ears, knees, elbows, earlobes, ankles"]
  },

  {
    question:
      "What is the fastest form of transport for a trip from New York to Los Angeles?",
    answer: "airplane",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:",
    hints: [
      "walking, driving in a car, airplane, swimming, scooter, taking amtrak, bicycle, sailboat, drone, mountain bike"
    ]
  },

  {
    question: "Which color of lights generally let you know to stop?",
    answer: "red",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:",
    hints: ["green, blue, ochre, pink, red, cyan, yellow, black, grey, purple"]
  },
  {
    question: "What color is the sky on a sunny day??",
    hints:
      ["red, blue, orange, green, white, black, brown, ochre, yellow, purple"],

      
    answer: "blue",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "What would you use to travel from New York to Paris? ",
    hints:
      ["car, bus, train, rollerblades, airplane, helicopter, tank, bicycle, motorcycle, skateboard"],
    answer: "airplane",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "Which animal is grown for milk?",
    hints: ["Lion, tiger, shark, shrimp, cow, squirrel, ant, bee, snake, deer"],
    answer: "cow",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "What does your computer need in order to turn on?",
    hints:
      ["Pasta, sand, electricity, watercolors, paint, sugar, water, humor, gas, milk"],
    answer: "electricity",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "What does every child have? ",
    hints:
      ["Rocks, blankets, cats, sneakers, freckles, baseballs, mother, flowers, cold, money"],
    answer: "mother",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "How many eyes does a human have?",
    hints: ["two, three, four, five, eleven, twenty, six, seven, eight, nine"],
    answer: "two",
    shown: false,
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "How many sides are there in a triangle?",
    answer: "three",
    shown: false,
    hints: ["two, three, four, five, eleven, twenty, six, seven, eight, nine"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "How many days are there in a week?",
    answer: "seven",
    shown: false,
    hints: ["two, three, four, five, eleven, twenty, six, seven, eight, nine"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "Which number comes after 9?",
    answer: "ten",
    shown: false,
    hints: ["two, three, four, five, eleven, twenty, six, seven, ten, nine"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "How many items are there in a dozen?",
    answer: "twelve",
    shown: false,
    hints: ["one, zero, four, five, twelve, twenty, six, seven, eight, nine"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "How many hours are there in one day?",
    answer: "24",
    shown: false,
    hints: ["1, 2, 3, 4, 5, 6, 12, 18, 19, 24"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "How many items are there in a hundred?",
    answer: "100",
    shown: false,
    hints: ["1, 14, 29, 84, 582, 38, 100, 293, 393, 3937"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "How many days are usually in one year?",
    answer: "365",
    shown: false,
    hints: ["1, 900, 38, 482, 584, 365, 38, 2, 11, 5"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "Which animal has black and white stripes?",
    answer: "zebra",
    shown: false,
    hints:
      ["Mouse, Lion, Zebra, Goat, Grasshopper, Turtle, Fly, Deer, Bear, Dove"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
    question: "Which animal is grown for eggs?",
    answer: "chicken",
    shown: false,
    hints:
      ["cow, crocodile, elephant, dolphin, lion, monkey, chicken, honeybee, fish, cat"],
    hintLine:
      "Please type the correct answer into the box below. You may choose from:"
  },
  {
question: "Which animal in the list below is a reptile with no legs?",
hints: ["cow, crocodile, elephant, dolphin, lion, monkey, chicken, honeybee, snake, cat"],
answer: "snake", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "Which bird lives in Antarctica?",
hints: ["pigeon, dove, eagle, penguin, parrot, crow, owl, humming bird, robin, woodpecker"],
answer: "penguin", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What’s the color of a ripe tomato?",
hints: ["blue, black, red, green, orange, white, brown, grey, silver, gold"],
answer: "red", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What’s the color of a tennis ball?",
hints: ["blue, black, red, yellow, white, brown, grey, silver, gold, cyan"],
answer: "yellow", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What is the color of milk?",
hints: ["blue, black, red, green, yellow, white, brown, grey, silver, gold"],
answer: "white", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What’s the color of the trees in summer?",
hints: ["blue, black, red, green, orange, white, brown, grey, silver, gold"],
answer: "green", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What’s the color of the coffee?",
hints: ["blue, black, red, green, orange, white, grey, silver, gold, pink"],
answer: "black", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "Where do kids go to learn?",
hints: ["train, desert, school, garden, office, bank, igloo, hospital, bakery, carwash"],
answer: "school", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "Where do patients go to get cured?",
hints: ["train, desert, school, garden, office, bank, igloo, hospital, bakery, carwash"],
answer: "hospital", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "Where do people go to deposit money?",
hints: ["train, desert, school, garden, office, bank, igloo, hospital, bakery, carwash"],
answer: "bank", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What do you call a house made of ice?",
hints: ["train, desert, school, garden, office, bank, igloo, hospital, bakery, carwash"],
answer: "igloo", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What is the name of the person who brings letters from the post office?",
hints: ["pilot, farmer, chef, doctor, lawyer, waiter, postman, manager, plumber, scientist"],
answer: "postman", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What is the name of the person who cures the patients?",
hints: ["pilot, farmer, chef, doctor, lawyer, waiter, postman, manager, plumber, scientist"],
answer: "doctor", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What is the name of the person who prepares bread and cakes?",
hints: ["farmer, teacher, doctor, lawyer, waiter, baker, manager, plumber, scientist"],
answer: "baker", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What is the word for a person who teaches in the school?",
hints: ["pilot, farmer, chef, doctor, lawyer, waiter, manager, teacher, plumber, scientist"],
answer: "teacher", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What are the ears for?",
hints: ["walking, singing, listening, driving, cooking, writing, smelling, running, talking, drinking"],
answer: "listening", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What do you use a pan for?",
hints: ["walking, singing, listening, driving, cooking, writing, smelling, running, talking, drinking"],
answer: "cooking", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What do you use the pencil for?",
hints: ["walking, singing, listening, driving, cooking, writing, smelling, running, talking, drinking"],
answer: "writing", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "What do you use shoes for?",
hints: ["walking, singing, listening, driving, cooking, writing, smelling, sitting, talking, drinking"],
answer: "walking", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "Which day comes after Friday?",
hints: ["monday, tuesday, wednesday, thursday, friday, saturday, sunday, christmas, easter, halloween"],
answer: "saturday", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "Which day comes after Tuesday ?",
hints: ["monday, tuesday, wednesday, thursday, friday, saturday, sunday, christmas, easter, halloween"],
answer: "wednesday", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },
{
question: "Which day comes after Monday ?",
hints: ["monday, tuesday, wednesday, thursday, friday, saturday, sunday, christmas, easter, halloween"],
answer: "tuesday", shown: false,
hintLine: "Please type the correct answer into the box below. You may choose from:" },

];

/** util  */
Bot.rndIntOne = max => Math.floor(Math.random() * max) + 1

// something is not working with this i bet
Bot.setContext = context => (bot_context = context);
Bot.getFont = () => Bot.promptFont
Bot.getErrorFont = () => {
  return { fontFamily: "Arial", fontSize: 18, color: "#aa0000" }}


Bot.promptFont = {
  fontFamily: "Arial",
  fontSize: 24,
  color: "#000",
  wordWrap: { width: 700, useAdvancedWrap: true }
};
