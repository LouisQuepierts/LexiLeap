import {Controller} from "./Controller.js";
import {Words} from "../Words.js";

export class QuestionController extends Controller {
    submitCallback;
    questionWord = null;

    constructor(type) {
        super();

        if (!window.child_controller) {
            window.child_controller = [];
        }
        window.child_controller[type] = this;
    }

    setSubmitCallback(callback) {
        this.submitCallback = callback;
    }

    onSubmit(question) {
        if (this.submitCallback !== null) {
            this.submitCallback(this, question);
        } else {
            this.next().then(() => {});
        }
    }

    review(question) {
        throw new Error('Method not implemented.');
    }

    setQuestion(question) {
        this.questionWord = question;
    }

    onKeyDown(e) {
        throw new Error('Method not implemented.');
    }

    async next() {
        const question = await Words.random(this.questionWord);
        this.setQuestion(question);
    }
}

export class QuestionHistory {
    capacity;
    pointer = 0;
    constructor(capacity = 100) {
        this.history = [];
        this.capacity = capacity;
    }

    push(data) {
        if (this.history.length === this.capacity) {
            this.history[this.pointer] = data;
        } else {
            this.history.push(data);
        }
        this.pointer = (this.pointer + 1) % this.capacity;
    }

    peek(shift = 0) {
        if (this.history.length === 0 || shift >= this.history.length) {
            return null;
        }
        return this.history[(this.pointer - shift - 1 + this.capacity) % this.capacity];
    }
}

export class QuestionData {
    type;
    data;
    result;
    checked = false;

    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}