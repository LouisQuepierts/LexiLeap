import {Controller} from "./Controller.class.js";
import {Words} from "../Words.js";

export class QuestionController extends Controller {
    submitCallback;
    questionWord;
    questionData;

    constructor(type) {
        super();

        if (!window.child_controller) {
            window.child_controller = [];
        }
        window.child_controller[type] = this;

        if (!window.use_inject) {
            document.addEventListener('keydown', this.onKeyDown);
        }
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

    async setQuestion(question) {
        this.questionWord = question;
    }

    onKeyDown(e) {}

    async next() {
        const question = (await Words.random())[0];
        await this.setQuestion(question);
    }

    static setTag(tagsElement, tagsData) {
        tagsElement.innerHTML = ``;
        for (let i = 0; i < tagsData.length; i++) {
            const tag = tagsData[i];
            tagsElement.innerHTML += `<div class="tag"><div class="tag-node" style="background-color: ${tag.color};"></div><span class="tag-name">${tag.name}</span></div>`
        }
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
    word;
    data;
    result;
    checked = false;

    constructor(type, word, data) {
        this.type = type;
        this.word = word;
        this.data = data;
    }
}