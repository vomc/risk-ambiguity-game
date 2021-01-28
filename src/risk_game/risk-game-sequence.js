var f = game_data.fonts;
var g = game_graphics;
var b = Bot;
var config = {
    //type: Phaser.WEBGL,
    width: 900, height: 600,
    backgroundColor: 0xbababa,
    gameData: {
        trials: null,
        turkData: null
    },
    gameKey: 'risk',
    shortGame: false,
    scene: [
        
        
        Title,
        Instructions,
        Quiz,
        PracticeIntro,
        PracticeTrial,
        PracticeEnd,
        Trial,
        Bonus,
        BotDetected,
        End


    ],
};
var cam = null;

var game = new Phaser.Game(config);