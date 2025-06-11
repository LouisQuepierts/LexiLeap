import {QuestionData, QuestionController} from "./QuestionController.js";

const regx = /^[a-zA-Z\-]$/;

const wordElement = document.getElementById('spelling-word')
const tagsElement = document.getElementById('tags');
const meaningElement = document.getElementById('spelling-meaning');
const pointer = document.getElementById('spelling-cursor');

const TYPE_SPELLING = 'spelling';

class SpellData {
    word;
    left;
    right;
    width;

    constructor(word, left, right, width) {
        this.word = word;
        this.left = left;
        this.right = right;
        this.width = width;
    }
}

class Spelling extends QuestionController {
    cursor = 0;

    constructor() {
        super(TYPE_SPELLING);
    }

    review(question) {
        if (question.type !== TYPE_SPELLING) {
            return;
        }

        pointer.classList.add('checked');
        const data = this.questionData.data;
        for (let i = data.left; i <= data.right; i++) {
            wordElement.children[i].classList.remove('hover');
            wordElement.children[i].innerHTML = this.questionData.data.spell[i];
            wordElement.children[i].classList.add('success');
        }
    }

    setQuestion(question) {
        super.setQuestion(question);
        pointer.classList.remove('checked');

        meaningElement.innerHTML = question.definition_cn;
        wordElement.innerHTML = ``;
        tagsElement.innerHTML = ``;

        const length = question.spell.length;
        const edge = Math.max(length / 3, 1);
        const left = Math.floor(Math.random() * edge);
        const right = length - Math.floor(Math.random() * edge) - 1;
        const width = right - left;
        this.cursor = 0;

        this.questionData = new QuestionData(
            TYPE_SPELLING,
            new SpellData(question, left, right, width)
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

        for (let i = 0; i < question.tags.length; i++) {
            const tag = question.tags[i];
            tagsElement.innerHTML += `<div class="tag"><div class="tag-node" style="background-color: ${tag.color};"></div><span class="tag-name">${tag.name}</span></div>`
        }
    }

    onKeyDown(e) {
        if (!this.enabled()) {
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
        let result = [];
        for (let i = data.left; i <= data.right; i++) {
            wordElement.children[i].classList.remove('hover');
            if (data.word.spell[i] === wordElement.children[i].innerHTML) {
                wordElement.children[i].classList.add('success');
                result.push(true);
            } else {
                wordElement.children[i].classList.add('failed');
                result.push(false);
            }
            wordElement.children[i].innerHTML = data.word.spell[i];
        }
        this.questionData.result = result;
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

const spell_controller = new Spelling();

document.addEventListener('keydown', e => spell_controller.onKeyDown(e));
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}