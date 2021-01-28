var f = game_data.fonts;
var g = game_graphics;
var config = {
    type: Phaser.WEBGL,
    width: 900, height: 600,
    backgroundColor: 0xbababa,
    trialData: {
        gameData: null,
        turkData: null,
    },
    shortGame: false,
    scene: [
        BotScene,
    ],
};

var cam = null;
var game = new Phaser.Game(config);