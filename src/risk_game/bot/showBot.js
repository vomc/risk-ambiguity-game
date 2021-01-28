class Bot {

    constructor(context) {
        this.context = context;
    }

    makeQuestion() {
        // ...
        return 'some question';
        
    }

    drawQuestion(context) {
        return context.add.text(100, 100, 'test');
    }


}

module.exports = Bot;
