import { PageInjector } from "./PageInjector.js";
import {QuestionController, QuestionHistory} from "./exercise/QuestionController.js";

const url = "../view/question/"

const question_types = [
    "spelling"
]

let controllers = [];
let future_question;

const MAX_REMAIN = 5;

const injector = new PageInjector("question-content", "-source", document);
const history = new QuestionHistory(100);

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

function onSubmitCallback(controller, question) {
    history.push(question);
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

for (const type of question_types) {
    await injector.load(type, url + type + ".html", page => {
        if (page.controller instanceof QuestionController) {
            page.controller.setSubmitCallback(onSubmitCallback);
            controllers[type] = page.controller;
        }
    });
}

injector.inject("spelling");
controllers["spelling"].next();