/**
 * 词库管理模块
 * 处理词库的CRUD操作和单词标记功能
 */

const WordManager = {
    // 初始化词库选择器
    initWordListSelect(selectElement) {
        const wordLists = DataStore.getAllWordLists();
        selectElement.innerHTML = '';

        Object.keys(wordLists).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            selectElement.appendChild(option);
        });
    },

    // 添加标签到单词
    addTagToWord(word, tag, listName) {
        const lists = DataStore.getAllWordLists();
        const wordList = lists[listName];

        const wordObj = wordList.find(w => w.word === word);
        if (wordObj && !wordObj.tags.includes(tag)) {
            wordObj.tags.push(tag);
            DataStore.saveWordList(listName, wordList);
        }
    },

    // 从单词移除标签
    removeTagFromWord(word, tag, listName) {
        const lists = DataStore.getAllWordLists();
        const wordList = lists[listName];

        const wordObj = wordList.find(w => w.word === word);
        if (wordObj) {
            wordObj.tags = wordObj.tags.filter(t => t !== tag);
            DataStore.saveWordList(listName, wordList);
        }
    },

    // 添加词缀分析
    addWordAnalysis(word, analysis, listName) {
        const lists = DataStore.getAllWordLists();
        const wordList = lists[listName];

        const wordObj = wordList.find(w => w.word === word);
        if (wordObj) {
            wordObj.analysis = analysis;
            DataStore.saveWordList(listName, wordList);
        }
    },

    // 导入词库处理
    handleFileImport(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const listName = file.name.replace(/\.[^/.]+$/, ""); // 移除扩展名
            const words = DataStore.importWordList(listName, e.target.result);
            callback(listName, words);
        };
        reader.readAsText(file);
    }
};