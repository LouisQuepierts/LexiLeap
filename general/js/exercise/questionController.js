export class QuestionController {
    enable;

    constructor() {
        if (!window.use_inject) {
            this.toggle(true);
        }
    }

    toggle(enable) {
        this.enable = enable;
    }

    enabled() {
        return this.enable;
    }

    record() {
        throw new Error('Method not implemented.');
    }

    review(question) {
        throw new Error('Method not implemented.');
    }
}

export class FinishedQuestion {
    word;
    type;
    append;

    constructor(word, type, append = {}) {
        this.word = word;
        this.type = type;
        this.append = append;
    }
}