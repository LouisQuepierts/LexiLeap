import {QuestionController, QuestionData} from "./QuestionController.class.js";
import {WordsClass} from "../Words.class.js";

const TYPE_MATCHING = "matching";
const ENTRIES_COUNT = 4;

const leftElement = document.getElementById("matching-left");
const rightElement = document.getElementById("matching-right");

class MatchingData {
    other;
    order;

    constructor(other, order) {
        this.other = other;
        this.order = order;
    }
}

class AnswerColumn {
    children;
    selected;

    constructor(element) {
        this.children = element;
        this.selected = -1;
    }

    reset() {
        for (let i = 0; i < ENTRIES_COUNT; i++) {
            this.children[i].classList.remove("selected", "correct", "incorrect");
        }
        this.selected = -1;
    }
}

class Matching extends QuestionController {
    left;
    right;
    matchedAmount = 0;
    missedAmount = 0;

    constructor() {
        super(TYPE_MATCHING);

        this.left = new AnswerColumn(leftElement.children);
        this.right = new AnswerColumn(rightElement.children);

        for (let i = 0; i < ENTRIES_COUNT; i++) {
            const leftButton = document.createElement("button");
            leftButton.classList.add("matching-button");
            leftButton.innerHTML = "";
            leftButton.addEventListener("click", () => this.click(this.left, i))
            leftElement.appendChild(leftButton);

            const rightButton = document.createElement("button");
            rightButton.classList.add("matching-button");
            rightButton.innerHTML = "";
            rightButton.addEventListener("click", () => this.click(this.right, i))
            rightElement.appendChild(rightButton);
        }
    }

    async setQuestion(question) {
        this.resetStatus();

        const other = await WordsClass.random(ENTRIES_COUNT - 1);
        const words = [question, ...other];
        const order = Array.from({length: ENTRIES_COUNT}, (_, index) => index);

        order.sort(() => Math.random() - 0.5);

        for (let i = 0; i < ENTRIES_COUNT; i++) {
            leftElement.children[i].innerHTML = words[i].spell;
            rightElement.children[i].innerHTML = words[order[i]].definition_cn;
        }

        this.questionData = new QuestionData(
            TYPE_MATCHING,
            question,
            new MatchingData(other, order)
        )
    }

    click(column, index) {
        const button = column.children[index];
        if (button.classList.contains("correct")) {
            this.trySubmit();
            return;
        }

        const selected = column.selected;
        if (selected === index) {
            return;
        }

        if (selected !== -1) {
            column.children[selected].classList.remove("selected");
        }

        button.classList.remove("incorrect");
        button.classList.add("selected");
        column.selected = index;
        this.tryMatching();
    }

    tryMatching() {
        const left = this.left.selected;
        const right = this.right.selected;

        if (left === -1 || right === -1) {
            return;
        }

        leftElement.children[left].classList.remove("selected");
        rightElement.children[right].classList.remove("selected");

        const matched = left === this.questionData.data.order[right];
        console.log(matched);

        if (matched) {
            leftElement.children[left].classList.add("correct");
            rightElement.children[right].classList.add("correct");
            this.matchedAmount ++;
        } else {
            leftElement.children[left].classList.add("incorrect");
            rightElement.children[right].classList.add("incorrect");

            setTimeout(() => {
                leftElement.children[left].classList.remove("incorrect");
                rightElement.children[right].classList.remove("incorrect");
            }, 1000)

            this.missedAmount ++;
        }

        this.left.selected = -1;
        this.right.selected = -1;
    }

    trySubmit() {
        if (this.matchedAmount < ENTRIES_COUNT) {
            return;
        }

        this.questionData.result = {
            missed: this.missedAmount,
        }

        this.onSubmit(this.questionData);
    }

    resetStatus() {
        this.matchedAmount = 0;
        this.left.reset();
        this.right.reset();
    }
}

new Matching();