import {QuestionController, QuestionData} from "./QuestionController.class.js";
import {Words} from "../Words.js";

const TYPE_MULTIPLE_CHOICE = "multiple-choice"
const ANSWER_COUNT = 4;

const wordElement = document.getElementById("multiple-choice-word");
const tagsElement = document.getElementById("multiple-choice-tags");
const answersElement = document.getElementById("multiple-choice-answers");

class MultipleChoiceData {
    disturbance;
    answer;

    constructor(disturbance, answer) {
        this.disturbance = disturbance;
        this.answer = answer;
    }
}

export class MultipleChoice extends QuestionController {
    constructor() {
        super(TYPE_MULTIPLE_CHOICE);

        for (let i = 0; i < ANSWER_COUNT; i++) {
            const button = document.createElement("button");
            button.classList.add("selection-button");
            button.innerHTML = "";
            answersElement.appendChild(button);
            button.addEventListener("click", () => {
                this.submit(i);
            });
        }
    }

    async setQuestion(question) {
        await super.setQuestion(question);
        const disturbance = await Words.random(ANSWER_COUNT - 1);
        const answer = Math.floor(Math.random() * ANSWER_COUNT);

        let j = 0;
        for (let i = 0; i < ANSWER_COUNT; i++) {
            if (i === answer) {
                answersElement.children[i].innerHTML = question.definition_cn;
            } else {
                answersElement.children[i].innerHTML = disturbance[j].definition_cn;
                j++;
            }
            answersElement.children[i].classList.remove("correct");
            answersElement.children[i].classList.remove("incorrect");
            answersElement.children[i].classList.remove("blocked");
        }

        this.questionData = new QuestionData(
            TYPE_MULTIPLE_CHOICE,
            question,
            new MultipleChoiceData(disturbance, answer)
        );

        wordElement.innerHTML = question.spell;
        QuestionController.setTag(tagsElement, question.tags);
    }

    submit(answer) {
        if (this.questionData.checked) {
            this.onSubmit(this.questionData);
            return;
        }

        this.questionData.checked = true;
        const rightAnswer = this.questionData.data.answer;
        const correct = answer === rightAnswer;

        if (correct) {
            answersElement.children[answer].classList.add("correct");
        } else {
            answersElement.children[answer].classList.add("incorrect");
            answersElement.children[rightAnswer].classList.add("correct");
            this.questionData.accuracy = 0;
        }

        for (let i = 0; i < ANSWER_COUNT; i++) {
            if (i === answer || i === rightAnswer) continue;
            answersElement.children[i].classList.add("blocked");
        }


        this.questionData.result = correct;
    }

    onKeyDown(e) {
        switch (e.key) {
            case "1":
            case "2":
            case "3":
            case "4":
                this.submit(parseInt(e.key) - 1);
                break;
        }
    }
}

const multiple_choice_controller = new MultipleChoice();