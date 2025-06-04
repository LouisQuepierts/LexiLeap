/**
 * 练习引擎模块
 * 生成题目、处理答题逻辑和反馈
 */

const QuizEngine = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    userAnswers: [],

    // 初始化练习
    initQuiz(wordListName, questionCount = 10) {
        const wordList = DataStore.getWordList(wordListName);
        const shuffled = [...wordList].sort(() => 0.5 - Math.random());
        this.currentQuiz = {
            listName: wordListName,
            words: shuffled.slice(0, questionCount),
            startTime: new Date()
        };
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        return this.currentQuiz;
    },

    // 获取当前问题
    getCurrentQuestion() {
        if (!this.currentQuiz || this.currentQuestionIndex >= this.currentQuiz.words.length) {
            return null;
        }
        return this.currentQuiz.words[this.currentQuestionIndex];
    },

    // 生成选择题
    generateMultipleChoice(wordObj, optionsCount = 4) {
        const wordList = DataStore.getWordList(this.currentQuiz.listName);
        const incorrectOptions = wordList
            .filter(w => w.word !== wordObj.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, optionsCount - 1)
            .map(w => w.meaning);

        const options = [
            wordObj.meaning,
            ...incorrectOptions
        ].sort(() => 0.5 - Math.random());

        return {
            type: 'multiple-choice',
            question: `"${wordObj.word}"的意思是？`,
            options: options,
            correctAnswer: wordObj.meaning
        };
    },

    // 生成拼写题
    generateSpellingQuestion(wordObj) {
        return {
            type: 'spelling',
            question: `如何拼写"${wordObj.meaning}"对应的英文单词？`,
            correctAnswer: wordObj.word
        };
    },

    // 随机生成题目
    generateQuestion() {
        const wordObj = this.getCurrentQuestion();
        if (!wordObj) return null;

        // 随机选择题型
        const questionTypes = ['multiple-choice', 'spelling'];
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        switch (type) {
            case 'multiple-choice':
                return this.generateMultipleChoice(wordObj);
            case 'spelling':
                return this.generateSpellingQuestion(wordObj);
            default:
                return this.generateMultipleChoice(wordObj);
        }
    },

    // 检查答案
    checkAnswer(userAnswer) {
        const currentWord = this.getCurrentQuestion();
        let isCorrect = false;

        if (typeof userAnswer === 'string') { // 拼写题
            isCorrect = userAnswer.toLowerCase() === currentWord.word.toLowerCase();
        } else { // 选择题
            isCorrect = userAnswer === currentWord.meaning;
        }

        this.userAnswers.push({
            word: currentWord,
            userAnswer,
            isCorrect,
            timestamp: new Date()
        });

        // 记录结果
        DataStore.recordPracticeResult(currentWord, isCorrect, this.currentQuiz.listName);

        return {
            isCorrect,
            correctAnswer: currentWord.meaning,
            wordAnalysis: currentWord.analysis
        };
    },

    // 移动到下一题
    nextQuestion() {
        this.currentQuestionIndex++;
        return this.getCurrentQuestion() !== null;
    },

    // 获取练习结果
    getQuizResults() {
        const correctCount = this.userAnswers.filter(a => a.isCorrect).length;
        return {
            totalQuestions: this.currentQuiz.words.length,
            correctCount,
            accuracy: Math.round((correctCount / this.currentQuiz.words.length) * 100),
            duration: (new Date() - this.currentQuiz.startTime) / 1000,
            details: this.userAnswers
        };
    }
};