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
            document.addEventListener('keydown', e => {
                this.onKeyDown(e);
            });
            this.next().then(() => {});
        }
    }

    setSubmitCallback(callback) {
        this.submitCallback = callback;
    }

    onSubmit(question) {
        if (!!this.submitCallback) {
            this.submitCallback(this, question);
        } else {
            this.next().then(() => {});
        }
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

export class QuestionData {
    type;
    word;
    data;
    result;
    accuracy = 100;
    checked = false;

    constructor(type, word, data) {
        this.type = type;
        this.word = word;
        this.data = data;
    }
}