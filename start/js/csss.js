
// DOM 元素
const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const answerOptionsElement = document.getElementById('answer-options');
const answerInput = document.getElementById('answer-input');
const mainHeader = document.getElementById('main-header');
const meaningElement = document.getElementById('meaning');
const wordElement = document.getElementById('word');
const cursorElement = document.getElementById('cursor');
const feedbackElement = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');



// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 监听 Enter 键开始游戏
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !startPage.classList.contains('hidden') && !event.shiftKey) {
            startQuiz();
            event.stopImmediatePropagation();
        }
    });

});




