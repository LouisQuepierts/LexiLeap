import {Words} from "./words.js";

const regx = /^[a-zA-Z\-]$/;

const word = document.getElementById('word')
const tags = document.getElementById('tags');
const meaning = document.getElementById('meaning');
const pointer = document.getElementById('cursor');

class Spell {
    words;
    question;
    cursor = 0;
    checked = false;
    left = 0;
    right = 0;
    width;

    constructor() {
        this.init().then(r => {});
    }

    async init() {
        this.words = await Words.get();
        this.setQuestion(this.words[0]);
    }

    submit() {
        if (this.checked) {
            const random = Math.floor(Math.random() * this.words.length);

            this.setQuestion(this.words[random]);
            this.checked = false;
            pointer.classList.remove('checked')
            return;
        }

        this.checked = true;
        pointer.classList.add('checked');
        for (let i = this.left; i <= this.right; i++) {
            word.children[i].classList.remove('hover');
            if (this.question.spell[i] === word.children[i].innerHTML) {
                word.children[i].classList.add('success');
            } else {
                word.children[i].classList.add('failed');
            }
            word.children[i].innerHTML = this.question.spell[i];
        }
    }

    typeIn(input) {
        const position = this.left + this.cursor;
        this.cursor++;
        this.updateCursor(this.cursor);
        if (position > this.right) {
            return
        }
        const letter = word.children[position];
        letter.innerHTML = input;
    }

    erase() {
        this.cursor--;
        const position = this.cursor + this.left;
        if (position >= this.left && position <= this.right) {
            word.children[position].innerHTML = '_';
        }
        this.updateCursor();
    }

    updateCursor() {
        this.cursor = clamp(this.cursor, 0, this.width + 1);

        const position = this.cursor + this.left;
        pointer.style.transform  = `translateX(${position * 26.5}px)`;
        /*for (let i = 0; i < word.children.length; i++) {
            const letter = word.children[i];
            letter.classList.remove('hover');
        }

        if (position <= right) {
            word.children[position].classList.add('hover');
        }*/
    }

    setQuestion(question) {
        this.question = question;
        meaning.innerHTML = question.definition_cn;
        word.innerHTML = ``;
        tags.innerHTML = ``;

        const length = question.spell.length;
        const edge = Math.max(length / 3, 1);
        this.left = Math.floor(Math.random() * edge);
        this.right = length - Math.floor(Math.random() * edge) - 1;
        this.width = this.right - this.left;
        this.cursor = 0;
        this.updateCursor()

        // log left, right, width
        // console.log(this.left, this.right, this.width);

        for (let i = 0; i < length; i++) {
            if (i < this.left || i > this.right) {
                word.innerHTML  += `<letter class="hint">` + question.spell[i] + `</letter>`
            } else {
                word.innerHTML += `<letter>_</letter>`
            }
        }

        for (let i = 0; i < question.tags.length; i++) {
            const tag = question.tags[i];
            tags.innerHTML += `<div class="tag"><div class="tag-node" style="background-color: ${tag.color};"></div><span class="tag-name">${tag.name}</span></div>`
        }
    }

    onKeyDown(e) {
        if (this.checked) {
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
}

const spell = new Spell();

document.addEventListener('keydown', e => spell.onKeyDown(e));
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}