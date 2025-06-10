import { PageInjector } from "./PageInjector.js";

const url = "../view/question/"

const question_types = [
    "spell"
]

const injector = new PageInjector("question-content", "-source", document);

for (const type of question_types) {
    await injector.load(type, url + type + ".html");
}

injector.inject("spell");