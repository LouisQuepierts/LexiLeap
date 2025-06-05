// 单词数据
const wordData = [
    { id: 1, word: "apple", meaning: "苹果", type: "choice", display: "meaning" },
    { id: 2, word: "computer", meaning: "电脑", type: "spelling" },
    { id: 3, word: "beautiful", meaning: "美丽的", type: "choice", display: "word" },
    { id: 4, word: "education", meaning: "教育", type: "spelling" },
    { id: 5, word: "environment", meaning: "环境", type: "choice", display: "meaning" },
    { id: 6, word: "technology", meaning: "技术", type: "spelling" },
    { id: 7, word: "communication", meaning: "交流", type: "choice", display: "word" },
    { id: 8, word: "knowledge", meaning: "知识", type: "spelling" },
    { id: 9, word: "development", meaning: "发展", type: "choice", display: "meaning" },
    { id: 10, word: "international", meaning: "国际的", type: "spelling" }
];

// 生成选择题的错误选项
function generateOptions(correct, meaning) {
    // 从单词库中随机选择3个错误选项
    const otherWords = wordData
        .filter(item => item.word !== correct && item.meaning !== meaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(item => item.display === "meaning" ? item.word : item.meaning);

    // 合并正确选项和错误选项
    const options = [correct, ...otherWords];

    // 随机排序选项
    return options.sort(() => Math.random() - 0.5);
}

// 练习状态
let currentQuestionIndex = 0;
let userAnswers = [];
let currentAnswer = "";
let isAnswered = false;

// 初始化练习
function initQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    document.getElementById('total').textContent = wordData.length;
    loadQuestion();
}

// 加载题目
function loadQuestion() {
    const question = wordData[currentQuestionIndex];

    // 更新进度
    document.getElementById('current').textContent = currentQuestionIndex + 1;
    document.getElementById('progress-bar').style.width = `${((currentQuestionIndex + 1) / wordData.length) * 100}%`;

    // 显示上一题单词
    const prevWordElement = document.getElementById('prev-word');
    if (currentQuestionIndex > 0) {
        const prev = wordData[currentQuestionIndex - 1];
        prevWordElement.textContent = `${prev.word} - ${prev.meaning}`;
    } else {
        prevWordElement.textContent = "";
    }

    // 重置状态
    const feedback = document.getElementById('feedback');
    feedback.textContent = "";
    feedback.className = "feedback";
    isAnswered = false;
    currentAnswer = "";

    // 根据题目类型显示不同内容
    const answerOptions = document.getElementById('answer-options');
    const answerInput = document.getElementById('answer-input');
    const questionDisplay = document.getElementById('question-text');
    const questionHint = document.getElementById('question-hint');

    if (question.type === "choice") {
        // 选择题模式
        answerOptions.innerHTML = "";
        answerInput.classList.add("hidden");

        // 设置问题显示
        if (question.display === "meaning") {
            questionDisplay.textContent = question.meaning;
            questionHint.textContent = "请选择正确的英文单词";
        } else {
            questionDisplay.textContent = question.word;
            questionHint.textContent = "请选择正确的中文意思";
        }

        // 生成选项
        const options = generateOptions(
            question.display === "meaning" ? question.word : question.meaning,
            question.meaning
        );

        // 添加选项按钮
        options.forEach(option => {
            const button = document.createElement("button");
            button.className = "option-btn";
            button.textContent = option;
            button.addEventListener("click", () => selectOption(option));
            answerOptions.appendChild(button);
        });

        answerOptions.classList.remove("hidden");
    } else {
        // 填空题模式
        answerOptions.classList.add("hidden");
        answerInput.classList.remove("hidden");
        document.getElementById('spelling-input').value = "";

        // 设置问题显示
        questionDisplay.textContent = question.meaning;
        questionHint.textContent = "请输入正确的英文拼写";

        // 聚焦输入框
        document.getElementById('spelling-input').focus();
    }
}

// 选择题选项选择
function selectOption(option) {
    if (isAnswered) return;

    // 移除之前的选择
    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.classList.remove("selected");
    });

    // 标记当前选择
    event.target.classList.add("selected");
    currentAnswer = option;
}

// 提交答案
function submitAnswer() {
    if (isAnswered) return;

    const question = wordData[currentQuestionIndex];
    let isCorrect = false;
    const feedback = document.getElementById('feedback');

    if (question.type === "choice") {
        if (!currentAnswer) {
            alert("请选择一个选项");
            return;
        }

        // 检查选择题答案
        if (question.display === "meaning") {
            isCorrect = currentAnswer === question.word;
        } else {
            isCorrect = currentAnswer === question.meaning;
        }
    } else {
        // 检查填空题答案
        const answer = document.getElementById('spelling-input').value.trim().toLowerCase();
        if (!answer) {
            alert("请输入答案");
            return;
        }

        isCorrect = answer === question.word.toLowerCase();
    }

    // 记录用户答案
    userAnswers[currentQuestionIndex] = {
        userAnswer: currentAnswer || document.getElementById('spelling-input').value.trim(),
        isCorrect: isCorrect
    };

    // 显示反馈
    feedback.textContent = isCorrect ? "✓ 正确！" : "✗ 错误！";
    feedback.className = isCorrect ? "feedback correct" : "feedback incorrect";

    isAnswered = true;
}

// 上一题
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

// 下一题
function nextQuestion() {
    const question = wordData[currentQuestionIndex];
    if (!isAnswered && question.type !== "choice") {
        alert("请先提交答案");
        return;
    }

    if (currentQuestionIndex < wordData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        alert("练习完成！");
        // 这里可以添加完成练习后的处理
    }
}