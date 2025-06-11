import { PageInjector } from "./PageInjector.js";
import {QuestionController, QuestionHistory} from "./exercise/QuestionController.js";

const url = "../view/question/"

const question_types = [
    "multiple-choice",
]

let controllers = [];

const injector = new PageInjector("question-content", "-source", document);
const history = new QuestionHistory(100);

function onSubmitCallback(controller, question) {
    history.push(question);
    const nextType = question_types[Math.floor(Math.random() * question_types.length)];
    console.log(nextType)
    injector.inject(nextType);
    controllers[nextType].next();
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