/**
 * 主应用模块
 * 处理UI交互和模块协调
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM元素
    const practiceSection = document.getElementById('practice-section');
    const wordbankSection = document.getElementById('wordbank-section');
    const statsSection = document.getElementById('stats-section');
    const settingsSection = document.getElementById('settings-section');

    const wordListSelect = document.getElementById('word-list-select');
    const startQuizBtn = document.getElementById('start-quiz');
    const nextQuestionBtn = document.getElementById('next-question');

    const wordDisplay = document.getElementById('current-word');
    const questionTypeDisplay = document.getElementById('question-type');
    const answerArea = document.getElementById('answer-area');
    const feedbackArea = document.getElementById('feedback-area');
    const progressCounter = document.getElementById('progress-counter');

    // 初始化UI
    function initUI() {
        // 初始化词库选择器
        WordManager.initWordListSelect(wordListSelect);

        // 设置导航点击事件
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.id.replace('nav-', '') + '-section';

                // 隐藏所有部分
                document.querySelectorAll('main section').forEach(section => {
                    section.classList.remove('active-section');
                });

                // 显示选中部分
                document.getElementById(sectionId).classList.add('active-section');
            });
        });

        // 开始练习按钮
        startQuizBtn.addEventListener('click', startNewQuiz);

        // 下一题按钮
        nextQuestionBtn.addEventListener('click', () => {
            feedbackArea.style.display = 'none';
            if (QuizEngine.nextQuestion()) {
                showQuestion();
            } else {
                showQuizResults();
            }
        });
    }

    // 开始新练习
    function startNewQuiz() {
        const wordListName = wordListSelect.value;
        QuizEngine.initQuiz(wordListName, 10);
        showQuestion();
    }

    // 显示题目
    function showQuestion() {
        const question = QuizEngine.generateQuestion();
        const currentWord = QuizEngine.getCurrentQuestion();

        // 更新进度显示
        progressCounter.textContent = `${QuizEngine.currentQuestionIndex + 1}/${QuizEngine.currentQuiz.words.length}`;

        // 显示单词
        wordDisplay.textContent = currentWord.word;

        // 显示题型
        questionTypeDisplay.textContent = question.type === 'multiple-choice' ?
            '选择正确的释义' : '拼写英文单词';

        // 生成答案区域
        answerArea.innerHTML = '';
        if (question.type === 'multiple-choice') {
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'multiple-choice';

            question.options.forEach(option => {
                const optionBtn = document.createElement('div');
                optionBtn.className = 'choice-option';
                optionBtn.textContent = option;
                optionBtn.addEventListener('click', () => handleAnswer(option));
                optionsContainer.appendChild(optionBtn);
            });

            answerArea.appendChild(optionsContainer);
        } else {
            const spellingContainer = document.createElement('div');
            spellingContainer.className = 'spelling-input';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '输入英文单词...';

            const submitBtn = document.createElement('button');
            submitBtn.textContent = '提交';
            submitBtn.addEventListener('click', () => handleAnswer(input.value));

            spellingContainer.appendChild(input);
            spellingContainer.appendChild(submitBtn);
            answerArea.appendChild(spellingContainer);

            // 回车键提交
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleAnswer(input.value);
                }
            });
        }
    }

    // 处理用户答案
    function handleAnswer(userAnswer) {
        const result = QuizEngine.checkAnswer(userAnswer);
        showFeedback(result);
    }

    // 显示反馈
    function showFeedback(result) {
        feedbackArea.style.display = 'block';
        feedbackArea.className = result.isCorrect ? 'feedback-area correct-feedback' : 'feedback-area incorrect-feedback';

        feedbackArea.innerHTML = `
            <p>${result.isCorrect ? '✓ 正确！' : '✗ 不正确'}</p>
            <p>正确答案: ${result.correctAnswer}</p>
            ${result.wordAnalysis ? `
            <div class="word-analysis">
                <p>词缀分析:</p>
                ${result.wordAnalysis.prefix ? `<span class="word-prefix">${result.wordAnalysis.prefix}<span class="tooltip">前缀</span></span>` : ''}
                ${result.wordAnalysis.root ? `<span class="word-root">${result.wordAnalysis.root}<span class="tooltip">词根</span></span>` : ''}
                ${result.wordAnalysis.suffix ? `<span class="word-suffix">${result.wordAnalysis.suffix}<span class="tooltip">后缀</span></span>` : ''}
            </div>
            ` : ''}
        `;

        nextQuestionBtn.disabled = false;
    }

    // 显示练习结果
    function showQuizResults() {
        const results = QuizEngine.getQuizResults();

        answerArea.innerHTML = `
            <div class="quiz-results">
                <h3>练习完成!</h3>
                <p>正确率: ${results.accuracy}% (${results.correctCount}/${results.totalQuestions})</p>
                <p>用时: ${results.duration.toFixed(1)}秒</p>
                <button id="restart-quiz">再练习一次</button>
            </div>
        `;

        document.getElementById('restart-quiz').addEventListener('click', startNewQuiz);
    }

    // 初始化应用
    initUI();
});