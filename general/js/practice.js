import { PageInjector } from "./PageInjector.class.js";
import {QuestionController, QuestionHistory} from "./exercise/QuestionController.class.js";

const url = "/LexiLeap/general/view/practice/"

const question_types = [
    "spelling",
    "multiple-choice",
    "matching",
]

const MAX_REMAIN = 5;

const injector = new PageInjector(
    "question-content",
    "-source",
    url,
    document
);
const history = new QuestionHistory(100);
let controllers = [];
let future_question;

class FutureQuestion {
    type;
    controller;
    remain;

    constructor(type, remain) {
        this.type = type;
        this.controller = controllers[type];
        this.remain = remain;
    }

    next() {
        if (this.remain > 0) {
            this.controller.next();
            this.remain --;
            return true;
        }

        return false;
    }
}

async function init() {
    for (const type of question_types) {
        await injector.load(type, type + ".html", page => {
            if (page.controller instanceof QuestionController) {
                page.controller.setSubmitCallback(onSubmitCallback);
                controllers[type] = page.controller;
            }
        });
    }

    injector.inject(question_types[0]);
    controllers[question_types[0]].next();
    nextQuestion();
}

function nextQuestion() {
    if (!future_question || !future_question.next()) {
        const nextType = question_types[Math.floor(Math.random() * question_types.length)];
        const nextAmount = Math.floor(Math.random() * MAX_REMAIN) + 1;
        future_question = new FutureQuestion(nextType, nextAmount);
        injector.inject(nextType);
        future_question.controller.next();
    }
}

function onSubmitCallback(controller, question) {
    history.push(question);
    nextQuestion();
}

init().then(() => {});
document.addEventListener('keydown', e => {
    if (e.key === "]") {
        nextQuestion();
        e.stopPropagation();
        return;
    }
    future_question.controller.onKeyDown(e);
});