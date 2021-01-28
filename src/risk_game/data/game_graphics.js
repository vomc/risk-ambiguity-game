// draws graphics
let game_graphics = {};


// TODO refactor this
let _pos = game_data.positions;
let _col = game_data.colors;
let _f = game_data.fonts;

game_graphics.addSpacebarToAdvance = function(context) {
    // creates the standard 'spacebar to advance' message present in the entire game
    // users can update the opacity as needed
    let spacebar_y = 580;


            
    return context.add.text(_pos.w /2, spacebar_y, 'Please tap the spacebar to continue', {
        fontFamily: "Arial",
        fontSize: 16,
        color: "#000000"

    }).setOrigin(0.5, 0.5).setAlpha(1);



}









// shorter version of below
game_graphics.addInstructionTextAt = function(x, y, text, font, origin, context) {
    if ((y == undefined) || (text == undefined)) 
        return;

    if (font == undefined) font = f.instructions.regular;
    if (origin == undefined) origin = 0.5;

    let style = 'normal';
    let textFont = {
        fontFamily: font.fam, 
        fontSize: font.size,
        color: font.color,
        style: style
    };
    
    if (font.style !== undefined) textFont.style = font.style;
    if (font.wordWrap !== undefined) textFont.wordWrap = {  width: 700, useAdvancedWrap: true };

    return context.add.text(x, y, text, textFont).setOrigin(origin)

}




// shorter version of below
game_graphics.addInstructionText = function(y, text, font, origin, context) {
    if ((y == undefined) || (text == undefined)) 
        return;

    if (font == undefined) font = f.instructions.regular;
    if (origin == undefined) origin = 0.5;

    let style = 'normal';
    let textFont = {
        fontFamily: font.fam, 
        fontSize: font.size,
        color: font.color,
        style: style
    };
    
    if (font.style !== undefined) textFont.style = font.style;
    if (font.wordWrap !== undefined) textFont.wordWrap = {  width: 700, useAdvancedWrap: true };

    return context.add.text(200, y, text, textFont).setOrigin(origin)

}



// instruction related methods
game_graphics.addText = function(x, y, text, font, origin, alpha, context) {
    if ((x === undefined) || (y === undefined) || (text === undefined)) 
        return;

    if (font === undefined) font = f.instructions.regular;
    if (origin === undefined) origin = 0.5;
    if (alpha === undefined) alpha = 1;    
    let style = 'normal';

    let textFont = {
        fontFamily: font.fam, 
        fontSize: font.size,
        color: font.color,
        style: style
    };
    
    if (font.style !== undefined) textFont.style = font.style;
    if (font.wordWrap !== undefined) textFont.wordWrap = {  width: 700, useAdvancedWrap: true };
        
    return context.add.text(x, y, text, textFont).setOrigin(origin).setAlpha(alpha);

   

}



/* ---- to support N to advance and B to go back for instructions */
game_graphics.instrux = {};

game_graphics.instrux.addOverlay = function(context) {

    return context.add
        .image(1, 1, 'px')
        .setOrigin(0,0)
        .setDisplaySize(900, 600)
        .setTint(0xbababa);
}

game_graphics.instrux.addHeadline = function(text, context) {

    return context.add.text(_pos.w/2, 90, text, 
            {   fontFamily: f.instructions.stageTitle.fam, 
                color: f.instructions.stageTitle.color, 
                fontSize: f.instructions.stageTitle.size }
        ).setOrigin(0.5);

}

game_graphics.instrux.addImage = function(imageKey, context) {

    return context.add
            .image(_pos.w/2, 310, imageKey)
            .setOrigin(0.5)
            .setScale(0.65);

            
}


game_graphics.instrux.addImageAtY = function(y, imageKey, context) {

    return context.add
            .image(_pos.w/2, y, imageKey)
            .setOrigin(0.5)
            .setScale(0.5);

            
}


