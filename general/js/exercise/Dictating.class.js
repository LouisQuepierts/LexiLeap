import {QuestionData, QuestionController} from "./QuestionController.class.js";

const regx = /^[a-zA-Z\-]$/;

const wordElement = document.getElementById('dictating-word')
const tagsElement = document.getElementById('dictating-tags');
const meaningElement = document.getElementById('dictating-meaning');
const pointer = document.getElementById('dictating-cursor');

const TYPE_SPELLING = 'dictating';

class DictatingData {
    left;
    right;
    width;

    constructor(left, right, width) {
        this.left = left;
        this.right = right;
        this.width = width;
    }
}

class Dictating extends QuestionController {
    cursor = 0;

    constructor() {
        super(TYPE_SPELLING);
    }

    async setQuestion(question) {
        await super.setQuestion(question);
        pointer.classList.remove('checked');

        meaningElement.innerHTML = question.definition_cn;
        wordElement.innerHTML = ``;

        const length = question.spell.length;
        const edge = Math.max(length / 3, 1);
        const left = Math.floor(Math.random() * edge);
        const right = length - Math.floor(Math.random() * edge) - 1;
        const width = right - left;
        this.cursor = 0;

        this.questionData = new QuestionData(
            TYPE_SPELLING,
            question,
            new DictatingData(left, right, width)
        );

        Object.freeze(this.questionData.data);
        this.updateCursor();

        for (let i = 0; i < length; i++) {
            if (i < left || i > right) {
                wordElement.innerHTML  += `<letter class="hint">` + question.spell[i] + `</letter>`
            } else {
                wordElement.innerHTML += `<letter>_</letter>`
            }
        }

        QuestionController.setTag(tagsElement, question.tags);
    }

    onKeyDown(e) {
        if (!this.enable) {
            return;
        }

        if (this.questionData.checked) {
            if (e.key === 'Enter') {
                this.submit();
            }
            return;
        }

        switch (e.key) {
            case 'Enter':
                this.submit();
                break;
            case 'ArrowLeft':
                this.cursor--;
                this.updateCursor();
                break;
            case 'ArrowRight':
                this.cursor++;
                this.updateCursor();
                break;
            case 'Backspace':
                this.erase();
                break;
            default:
                if (regx.test(e.key)) {
                    this.typeIn(e.key);
                }
        }
    }

    submit() {
        if (this.questionData.checked) {
            this.onSubmit(this.questionData);
            return;
        }

        this.questionData.checked = true;
        pointer.classList.add('checked');
        const data = this.questionData.data;
        const word = this.questionData.word;
        let result = [];
        let correct = 0;
        for (let i = data.left; i <= data.right; i++) {
            const letter = wordElement.children[i];
            result.push(letter.innerHTML);
            letter.classList.remove('hover');
            if (word.spell[i] === letter.innerHTML) {
                letter.classList.add('success');
                correct ++;
            } else {
                letter.classList.add('failed');
            }
            letter.innerHTML = word.spell[i];
        }
        this.questionData.result = result;
        this.questionData.accuracy = (correct / data.width) * 100;
    }

    typeIn(input) {
        const position = this.questionData.data.left + this.cursor;
        this.cursor++;
        this.updateCursor(this.cursor);
        if (position > this.right) {
            return
        }
        const letter = wordElement.children[position];
        letter.innerHTML = input;
    }

    erase() {
        this.cursor--;

        const data = this.questionData.data;
        const position = this.cursor + data.left;
        if (position >= data.left && position <= data.right) {
            wordElement.children[position].innerHTML = '_';
        }
        this.updateCursor();
    }

    updateCursor() {
        const data = this.questionData.data;
        this.cursor = clamp(this.cursor, 0, data.width + 1);

        const position = this.cursor + data.left;
        pointer.style.transform  = `translateX(${position * 26.5}px)`;
    }
}

const spell_controller = new Dictating();

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}