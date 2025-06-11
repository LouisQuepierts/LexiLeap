import {QuestionController} from "./QuestionController.js";
import {Words} from "../Words.js";

const TYPE_MATCHING = "matching";
const ENTRIES_COUNT = 4;

const leftElement = document.getElementById("matching-left");
const rightElement = document.getElementById("matching-right");

class MatchingData {
    disturbs;

    constructor(disturbs) {
        this.disturbs = disturbs;
    }
}

class Matching extends QuestionController {
    constructor() {
        super(TYPE_MATCHING);

        for (let i = 0; i < ENTRIES_COUNT; i++) {
            const leftButton = document.createElement("button");
            leftButton.classList.add("matching-button");
            leftButton.innerHTML = "";
            leftButton.addEventListener("click", () => console.log("left " + i))
            leftElement.appendChild(leftButton);

            const rightButton = document.createElement("button");
            rightButton.classList.add("matching-button");
            rightButton.innerHTML = "";
            rightButton.addEventListener("click", () => console.log("right " + i))
            rightElement.appendChild(rightButton);
        }
    }

    async setQuestion(question) {
        const other = await Words.random(ENTRIES_COUNT - 1);
    }
}

new Matching();