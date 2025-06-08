// 模拟单词数据
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
//允许输入字母和连字符
const regx = /^[a-zA-Z\-]$/;




// DOM元素
const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const questionDisplay = document.getElementById('question-display');
const answerOptions = document.getElementById('answer-options');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-answer');
const startButton = document.getElementById('startButton');
const mainHeader = document.getElementById('main-header');
const spellingInput = document.getElementById('answer-input'); // 添加声明

// DOM 元素引用：获取单词显示区、释义和光标元素
const wordList=words;
const word = document.getElementById('word');
const meaning = document.getElementById('meaning');
const pointer = document.getElementById('cursor');


// 游戏状态变量
let cursor = 0;            // 当前光标位置（相对于隐藏字母区域）
let currentQuestion = words[0];  // 当前练习的单词
let checked = false;       // 是否已提交答案
let left = 0;              // 隐藏字母区域的左边界索引
let right = 0;             // 隐藏字母区域的右边界索引
let width;                 // 隐藏字母区域的宽度


// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 监听Enter键
    document.addEventListener('keydown', (event) => {
        // 仅在开始页面且未按下Shift时响应Enter键
        if (event.key === 'Enter' && !startPage.classList.contains('hidden') && !event.shiftKey) {
            startQuiz();
            // 阻止事件冒泡，避免被下面的监听器捕获
            event.stopImmediatePropagation();
        }
    });
});

// 开始练习
function startQuiz() {
    // 隐藏开始页面
    startPage.classList.add('hidden');

    // 显示导航栏和练习页面
    mainHeader.classList.remove('hidden');
    quizPage.classList.remove('hidden');

    // 初始化第一个单词
    setQuestion(currentQuestion);
    // 立即聚焦输入框
    answerInput.focus();
}
// 实现缺失的函数
function showMultipleChoiceQuestion() {
    // 实现选择题逻辑
    console.log("Showing multiple choice question");
}

// 生成题目
function generateQuestion() {
    // 随机选择单词
    const randomIndex = Math.floor(Math.random() * wordList.length);
    currentQuestion = wordList[randomIndex];

    // 随机选择题型 (选择题或填空题)
    currentQuestionType = Math.random() > 0.5 ? 'multiple-choice' : 'spelling';

    // 显示题目
    if (currentQuestionType === 'multiple-choice') {
        showMultipleChoiceQuestion();
    } else {
        showSpellingQuestion();
    }
}

function submit() {
    if (checked) {
        // 已提交状态下，切换到下一个随机单词
        const random = Math.floor(Math.random() * words.length);
        currentQuestion = words[random];
        setQuestion(currentQuestion);
        checked = false;
        pointer.classList.remove('checked');
        return;
    }

    // 首次提交：检查答案并显示结果
    checked = true;
    pointer.classList.add('checked');  // 修改光标样式

    // 遍历隐藏字母区域，检查每个字符
    for (let i = left; i <= right; i++) {
        word.children[i].classList.remove('hover');
        if (word.children[i].innerHTML === currentQuestion.english[i]) {
            word.children[i].classList.add('success');  // 正确字符标绿
        } else {
            word.children[i].classList.add('failed');   // 错误字符标红
        }
        // 无论对错，最终显示正确答案
        word.children[i].innerHTML = currentQuestion.english[i];
    }
}

document.addEventListener('keydown', e => {
    // 如果还在开始页面，不处理
    if (!startPage.classList.contains('hidden')) return;
    // 已提交状态下，按 Enter 进入下一题
    if (checked) {
        if (e.key === 'Enter') submit();
        return;
    }

    // 未提交状态下，处理各种按键
    switch (e.key) {
        case 'Enter':
            submit();  // 提交答案
            break;
        case 'ArrowLeft':
            cursor--;  // 左移光标
            updateCursor();
            break;
        case 'ArrowRight':
            cursor++;  // 右移光标
            updateCursor();
            break;
        case 'Backspace':
            erase();   // 删除当前位置字符
            break;
        default:
            // 验证输入是否为合法字符（字母或连字符）
            if (regx.test(e.key)) typeIn(e.key);
    }
});

function typeIn(input) {
    const position = left + cursor;  // 计算实际 DOM 位置
    cursor++;  // 光标右移
    updateCursor();

    if (position > right) return;  // 超出右边界则忽略

    // 更新当前位置的字符
    const letter = word.children[position];
    letter.innerHTML = input;
}

function erase() {
    cursor--;  // 光标左移
    const position = cursor + left;

    // 仅在有效范围内删除字符
    if (position >= left && position <= right) {
        word.children[position].innerHTML = '_';  // 恢复下划线占位符
    }
    updateCursor();
}

// 显示拼写题
function showSpellingQuestion() {
    questionDisplay.textContent = currentQuestion.meaning;
    answerOptions.classList.add('hidden');
    answerInput.classList.remove('hidden');
    answerInput.focus(); // 关键：获取焦点
}

function updateCursor() {
    // 限制光标范围在 0 到 width 之间
    cursor = clamp(cursor, 0, width); // 修正最大值为 width
    // 确保 word 元素已生成子节点
    const letters = word.children;
    // 计算光标在页面中的实际位置（每个字母宽度 27px）
    const position = cursor + left;
    const letterWidth = 26.5 || word.children[0]?.offsetWidth; // 动态获取字母宽度
    pointer.style.transform = `translateX(${position * letterWidth}px)`;
    // 注释掉的代码：原用于高亮当前位置字符
    /*for (let i = 0; i < word.children.length; i++) {
        word.children[i].classList.remove('hover');
    }
    if (position <= right) {
        word.children[position].classList.add('hover');
    }*/
}

function setQuestion(question) {
    meaning.innerHTML = question.chinese;  // 更新中文释义
    word.innerHTML = '';  // 清空单词显示区

    const length = question.english.length;
    // 计算隐藏字母区域（保留首尾部分字母作为提示）
    const edge = Math.max(length / 3, 1);
    left = Math.floor(Math.random() * edge);  // 随机左边界
    right = length - Math.floor(Math.random() * edge) - 1;  // 随机右边界
    width = right - left+1;  // 隐藏区域宽度
    cursor = 0;  // 重置光标位置
    updateCursor();

    // 构建单词 DOM：提示字母用 <letter class="hint">，需填写部分用 <letter>_</letter>
    for (let i = 0; i < length; i++) {
        if (i < left || i > right) {
            word.innerHTML += `<span class="hint">${question.english[i]}</span>`;
        } else {
            word.innerHTML += `<letter>_</letter>`;
        }
    }
    // 立即更新光标并聚焦
    updateCursor();
    answerInput.focus();
}

// 限制值在 [min, max] 范围内
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
// 显示上一题（当前未实现，简单处理为生成新题）
function showPreviousQuestion() {
    generateQuestion();
}