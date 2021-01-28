let game_data = {};

game_data.positions = {
    
    // canvas
    w: 900,
    h: 600,
    
    
    // columns
    column_to_edge: 104,
    column_from_top: 50,
    column_w: 150,
    column_h: 500,

    // shading on top of columns
    col_shade_1_w: 113,
    col_shade_2_w: 32,

    // lines
    line_thickness: 7,
};


// colors and opacities
game_data.colors = {
    
    
    bg: 0xbababa, 
    
    // column
    col_bg: 0x55beef, 
    col_overlay_opacity: 0.25,

    // line
    line: 0xf1f519,



    // instructions
    stageTitle: 100,


};

 
game_data.fonts = {

    titleLine: {
        fam: "Arial",
        size: 78,
        color: "#333"
    },

    spaceBarLine: {
        fam: 'Arial',
        size: 18,
        color: "#000"
    },


    instructions: {

        mainTitle: {
            fam: "Arial",
            size: 45,
            color: "#000",
            style: "bold"
        },


        stageTitle: {
            fam: "Arial",
            size: 36,
            color: "#000",
        },



        title: {
            fam: "Arial",
            size: 50,
            color: "#333",
            style: "bold"
        },
        
        bold: {
            fam: "Arial",
            size: 45,
            color: "#000",
            style: "bold"
        },

        regular: {
            fam: "Arial",
            size: 36,
            color: "#333",
            style: "normal",
            wordWrap: { width: 700, useAdvancedWrap: true }
        },
        red: {
            fam: "Arial",
            size: 36,
            color: "#ff0000",
            style: "normal",
            wordWrap: { width: 700, useAdvancedWrap: true }
        },

        small: {
            fam: "Arial",
            size: 24,
            color: "#333",
            style: "normal",
            wordWrap: { width: 700, useAdvancedWrap: true }

        },

        spacebar: {
            fam: "Arial",
            size: 24,
            color: "#999",
            style: "normal"

        }




    },
    
    // smaller in trial
    prompts: {
        // tap spacebar ... 
        spacebar: {
            fam: 'Arial',
            size: 14,
            color: "#999"
        },

        timeout: {
            
            fam: 'Arial',
            size: 24,
            color: "#630000"

        },
        practiceCounter: {
            
            fam: 'Arial',
            size: 18,
            color: "#999"

        }

    },

    numbers: {

        bag: {
            fam: "Arial",
            size: 28,
            color: '#000'
        },

        static: {
            // static top and bottoms of columns
            // ie. 0 - 500
            fam: "Arial",
            size: 18,
            color: '#666'
        }
    }
    

    


}