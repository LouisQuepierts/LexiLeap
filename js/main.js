// 模拟单词数据
const wordList = [
    { word: "apple", meaning: "苹果" },
    { word: "banana", meaning: "香蕉" },
    { word: "computer", meaning: "电脑" },
    { word: "diligent", meaning: "勤奋的" },
    { word: "elephant", meaning: "大象" }
];

// DOM元素
// DOM元素
const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const questionDisplay = document.getElementById('question-display');
const answerOptions = document.getElementById('answer-options');
const answerInput = document.getElementById('answer-input');
const spellingInput = document.getElementById('spelling-input');
const submitBtn = document.getElementById('submit-answer');
const startButton = document.getElementById('startButton');
const mainHeader = document.getElementById('main-header');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');


// 当前题目和状态
let currentQuestion = null;
let currentQuestionType = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 监听Enter键
    document.addEventListener('keydown', (event) => {
        // 仅在开始页面且未按下Shift时响应Enter键
        if (event.key === 'Enter' && !startPage.classList.contains('hidden') && !event.shiftKey) {
            startQuiz();
        }
    });

    // 开始按钮点击事件
    startButton.addEventListener('click', startQuiz);

    // 提交答案按钮
    submitBtn.addEventListener('click', checkSpellingAnswer);

    // 输入框回车提交
    spellingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkSpellingAnswer();
        }
    });

    // 上一题/下一题按钮
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', generateQuestion);
});

// 开始练习
function startQuiz() {
    // 隐藏开始页面
    startPage.classList.add('hidden');

    // 显示导航栏和练习页面
    mainHeader.classList.remove('hidden');
    quizPage.classList.remove('hidden');

    // 生成第一题
    generateQuestion();

    // 滚动到练习页面顶部
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
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

// 显示选择题
function showMultipleChoiceQuestion() {
    // 随机决定显示英文选中文，还是显示中文选英文
    const showWordFirst = Math.random() > 0.5;

    // 设置问题显示
    questionDisplay.textContent = showWordFirst ? currentQuestion.word : currentQuestion.meaning;

    // 生成选项
    answerOptions.innerHTML = '';
    answerInput.classList.add('hidden');
    answerOptions.classList.remove('hidden');

    // 获取3个错误选项
    const wrongOptions = wordList
        .filter(item => item.word !== currentQuestion.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(item => showWordFirst ? item.meaning : item.word);

    // 添加正确选项
    const correctOption = showWordFirst ? currentQuestion.meaning : currentQuestion.word;
    const allOptions = [...wrongOptions, correctOption].sort(() => 0.5 - Math.random());

    // 创建选项按钮
    allOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => {
            checkMultipleChoiceAnswer(option, correctOption);
        });
        answerOptions.appendChild(button);
    });
}

// 显示拼写题
function showSpellingQuestion() {
    // 总是显示中文，要求拼写英文
    questionDisplay.textContent = currentQuestion.meaning;

    answerOptions.classList.add('hidden');
    answerInput.classList.remove('hidden');
    spellingInput.value = '';
    spellingInput.focus();
}

// 检查选择题答案
function checkMultipleChoiceAnswer(selectedOption, correctOption) {
    const isCorrect = selectedOption === correctOption;

    // 给用户反馈
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === correctOption) {
            button.style.backgroundColor = isCorrect ? 'var(--correct)' : 'var(--correct)';
            button.style.color = 'white';
        } else if (button.textContent === selectedOption && !isCorrect) {
            button.style.backgroundColor = 'var(--incorrect)';
            button.style.color = 'white';
        }
    });

    // 3秒后自动进入下一题
    setTimeout(generateQuestion, 3000);
}

// 检查拼写题答案
function checkSpellingAnswer() {
    const userAnswer = spellingInput.value.trim().toLowerCase();
    const isCorrect = userAnswer === currentQuestion.word.toLowerCase();

    // 给用户反馈
    answerInput.classList.add('hidden');
    questionDisplay.innerHTML = `
        <span style="color: ${isCorrect ? 'var(--correct)' : 'var(--incorrect)'}">
            ${isCorrect ? '✓ 正确!' : '✗ 不正确'}
        </span><br>
        ${currentQuestion.meaning} = ${currentQuestion.word}
    `;

    // 3秒后自动进入下一题
    setTimeout(generateQuestion, 3000);
}

// 显示上一题（当前未实现，简单处理为生成新题）
function showPreviousQuestion() {
    generateQuestion();
}