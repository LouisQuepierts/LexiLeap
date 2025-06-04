/**
 * 本地数据存储模块
 * 使用localStorage实现词库和用户数据的持久化存储
 */

const DataStore = {
    // 初始化本地存储
    init() {
        if (!localStorage.getItem('wordLists')) {
            localStorage.setItem('wordLists', JSON.stringify({
                'default': [
                    { word: 'example', meaning: '例子', tags: ['高频'],
                        analysis: { prefix: 'ex-', root: 'ampl', suffix: '-e' } }
                ]
            }));
        }

        if (!localStorage.getItem('userData')) {
            localStorage.setItem('userData', JSON.stringify({
                stats: {},
                wrongWords: [],
                lastPractice: null
            }));
        }
    },

    // 获取所有词库
    getAllWordLists() {
        return JSON.parse(localStorage.getItem('wordLists'));
    },

    // 获取特定词库
    getWordList(name) {
        const lists = this.getAllWordLists();
        return lists[name] || [];
    },

    // 添加/更新词库
    saveWordList(name, words) {
        const lists = this.getAllWordLists();
        lists[name] = words;
        localStorage.setItem('wordLists', JSON.stringify(lists));
    },

    // 导入词库
    importWordList(name, text) {
        const words = text.split('\n').map(line => {
            const [word, meaning] = line.split(',');
            return { word: word.trim(), meaning: meaning.trim(), tags: [] };
        });
        this.saveWordList(name, words);
        return words;
    },

    // 获取用户数据
    getUserData() {
        return JSON.parse(localStorage.getItem('userData'));
    },

    // 更新用户数据
    updateUserData(data) {
        localStorage.setItem('userData', JSON.stringify(data));
    },

    // 记录练习结果
    recordPracticeResult(word, isCorrect, listName) {
        const userData = this.getUserData();

        // 更新统计
        if (!userData.stats[listName]) {
            userData.stats[listName] = { total: 0, correct: 0 };
        }
        userData.stats[listName].total++;
        if (isCorrect) userData.stats[listName].correct++;

        // 记录错题
        if (!isCorrect && !userData.wrongWords.some(w => w.word === word.word)) {
            userData.wrongWords.push({ ...word, listName });
        }

        userData.lastPractice = new Date().toISOString();
        this.updateUserData(userData);
    }
};

// 初始化数据存储
DataStore.init();