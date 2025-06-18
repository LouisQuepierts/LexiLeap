import {QuestionController, QuestionData} from "./QuestionController.class.js";
import {Words} from "../Words.js";

const TYPE_MATCHING = "matching";
const ENTRIES_COUNT = 4;

const leftElement = document.getElementById("matching-left");
const rightElement = document.getElementById("matching-right");

class MatchingData {//数据
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

        const other = await Words.random(ENTRIES_COUNT - 1);
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

    tryMatching() {//验证是否配对
        const left = this.left.selected; // 获取左侧选中项的索引
        const right = this.right.selected; // 获取右侧选中项的索引

        if (left === -1 || right === -1) {
            return;// 如果任意一列没有选中项，直接返回
        }

        leftElement.children[left].classList.remove("selected");// 移除左侧选中样式
        rightElement.children[right].classList.remove("selected");

        const matched = left === this.questionData.data.order[right]; // 判断匹配是否正确
        console.log(matched);// 打印匹配结果到控制台（用于调试）

        if (matched) {//如果匹配
            leftElement.children[left].classList.add("correct");//标记为正确
            rightElement.children[right].classList.add("correct");
            this.matchedAmount ++;//正确数量增加
        } else {
            leftElement.children[left].classList.add("incorrect");
            rightElement.children[right].classList.add("incorrect");

            setTimeout(() => {
                leftElement.children[left].classList.remove("incorrect");//1s后清楚错误标记
                rightElement.children[right].classList.remove("incorrect");
            }, 1000)

            this.missedAmount ++;
        }

        this.left.selected = -1;// 重置左侧选中状态
        this.right.selected = -1;
    }

    trySubmit() {
        if (this.matchedAmount < ENTRIES_COUNT) {
            return;
        }

        this.questionData.result = {
            missed: this.missedAmount,
        }

        const totalTry = this.matchedAmount + this.missedAmount;
        this.questionData.accuracy = Math.round(this.matchedAmount / totalTry * 100);

        this.onSubmit(this.questionData);
    }

    resetStatus() {
        this.matchedAmount = 0;
        this.left.reset();
        this.right.reset();
    }
}

new Matching();