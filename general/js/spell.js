const words = [
    { english: "photosynthesis", chinese: "光合作用" },
    { english: "democracy", chinese: "民主" },
    { english: "capitalism", chinese: "资本主义" },
    { english: "psychology", chinese: "心理学" },
    { english: "architecture", chinese: "建筑" },
    { english: "astronomy", chinese: "天文学" },
    { english: "cuisine", chinese: "烹饪" },
    { english: "philosophy", chinese: "哲学" },
    { english: "technology", chinese: "技术" },
    { english: "ecology", chinese: "生态学" }
]

const regx = /^[a-zA-Z\-]$/;

const word = document.getElementById('word')
const meaning = document.getElementById('meaning');
const pointer = document.getElementById('cursor');

let cursor = 0;
let currentQuestion = words[0];
let checked = false;
let left = 0;
let right = 0;
let width;

setQuestion(currentQuestion);

document.addEventListener('keydown', e => {
    if (checked) {
        if (e.key === 'Enter') {
            submit();
        }
        return;
    }

    switch (e.key) {
        case 'Enter':
            submit();
            break;
        case 'ArrowLeft':
            cursor--;
            updateCursor();
            break;
        case 'ArrowRight':
            cursor++;
            updateCursor();
            break;
        case 'Backspace':
            erase();
            break;
        default:
            if (regx.test(e.key)) {
                typeIn(e.key);
            }
    }

    function submit() {
        if (checked) {
            const random = Math.floor(Math.random() * words.length);
            currentQuestion = words[random];

            setQuestion(currentQuestion);
            checked = false;
            pointer.classList.remove('checked')
            return;
        }

        checked = true;
        pointer.classList.add('checked');
        for (let i = left; i <= right; i++) {
            word.children[i].classList.remove('hover');
            if (currentQuestion.english[i] === word.children[i].innerHTML) {
                word.children[i].classList.add('success');
            } else {
                word.children[i].classList.add('failed');
            }
            word.children[i].innerHTML = currentQuestion.english[i];
        }
    }

    function typeIn(input) {
        const position = left + cursor;
        cursor++;
        updateCursor(cursor);
        if (position > right) {
            return
        }
        const letter = word.children[position];
        letter.innerHTML = input;
    }

    function erase() {
        cursor--;
        const position = cursor + left;
        if (position >= left && position <= right) {
            word.children[position].innerHTML = '_';
        }
        updateCursor(cursor);
    }

    function updateCursor() {
        cursor = clamp(cursor, 0, width + 1);

        const position = cursor + left;
        pointer.style.transform  = `translateX(${position * 27}px)`;
        /*for (let i = 0; i < word.children.length; i++) {
            const letter = word.children[i];
            letter.classList.remove('hover');
        }

        if (position <= right) {
            word.children[position].classList.add('hover');
        }*/
    }

    function setQuestion(question) {
        meaning.innerHTML = question.chinese;
        word.innerHTML = ``;

        const length = question.english.length;
        const edge = Math.max(length / 3, 1);
        left = Math.floor(Math.random() * edge);
        right = length - Math.floor(Math.random() * edge) - 1;
        width = right - left;
        cursor = 0;
        updateCursor()

        // log left, right, width
        console.log(left, right, width);

        for (let i = 0; i < length; i++) {
            if (i < left || i > right) {
                word.innerHTML  += `<letter class="hint">` + question.english[i] + `</letter>`
            } else {
                word.innerHTML += `<letter>_</letter>`
            }
        }
    }
});


function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}