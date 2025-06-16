import {QuestionData, QuestionController} from "./QuestionController.class.js";

const regx = /^[a-zA-Z\-]$/;

const wordElement = document.getElementById('spelling-word')
const tagsElement = document.getElementById('spelling-tags');
const meaningElement = document.getElementById('spelling-meaning');
const pointer = document.getElementById('spelling-cursor');

const TYPE_SPELLING = 'spelling';

class SpillingData {
    width;
    tries = 0;
    mistaken = 0;

    constructor(width) {
        this.width = width;
    }
}

class Spelling extends QuestionController {
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
        this.cursor = 0;

        this.questionData = new QuestionData(
            TYPE_SPELLING,
            question,
            new SpillingData(length)
        );

        this.updateCursor();

        for (let i = 0; i < length; i++) {
            const letter = document.createElement('letter');
            letter.innerHTML = question.spell[i];
            wordElement.appendChild( letter);
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
            default:
                if (regx.test(e.key)) {
                    this.typeIn(e.key);
                }
        }
    }

    submit() {
        if (this.questionData.checked) {
            this.onSubmit(this.questionData);
        }
    }

    typeIn(input) {
        const position = this.cursor;
        this.cursor++;
        this.updateCursor(this.cursor);
        const data = this.questionData.data;
        if (position >= data.width) {
            return;
        }
        const letter = wordElement.children[position];
        if (this.questionData.word.spell[ position] === input) {
            letter.classList.add('success');

            if (position === data.width - 1) {
                for (const letter of wordElement.children) {
                    letter.classList.add('checked');
                }

                data.tries ++;
                this.questionData.checked = true;
                this.questionData.accuracy = Math.round(data.mistaken / data.tries * 100);
                pointer.classList.add('checked');
            }

        } else {
            data.tries ++;
            data.mistaken ++;

            letter.classList.add('failed');
            wordElement.classList.add('shake');

            this.enable = false;
            setTimeout(() => {
                for (const letter of wordElement.children) {
                    letter.classList.remove('failed', 'success');
                }
                wordElement.classList.remove('shake');
                this.cursor = 0;
                this.updateCursor();
            }, 500);

            setTimeout(() => {
                this.enable = true;
            }, 1000);
        }
    }

    updateCursor() {
        const data = this.questionData.data;
        this.cursor = clamp(this.cursor, 0, data.width);

        const position = this.cursor;
        pointer.style.transform  = `translateX(${position * 26.5}px)`;
    }
}

const spell_controller = new Spelling();

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}