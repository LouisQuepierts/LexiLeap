// 模拟数据 - 在实际应用中，这部分应该从API获取
let mockWords = [
    { id: 1, word: "abandon", chineseDef: "放弃", englishDef: "cease to support or look after (someone); desert.", example: "She abandoned her cat when she moved to another country." },
    { id: 2, word: "absorb", chineseDef: "吸收", englishDef: "take in or soak up (energy or a liquid or other substance) by chemical or physical action.", example: "Plants absorb carbon dioxide during photosynthesis." },
    { id: 3, word: "abundant", chineseDef: "丰富的", englishDef: "existing or available in large quantities; plentiful.", example: "The region has abundant natural resources." },
    { id: 4, word: "accomplish", chineseDef: "完成", englishDef: "achieve or complete successfully.", example: "They managed to accomplish their goal before the deadline." },
    { id: 5, word: "accustomed", chineseDef: "习惯的", englishDef: "used to (something, typically something uncomfortable or unwelcome).", example: "She was accustomed to working long hours." }
];

// DOM元素
const wordList = document.getElementById('word-list');
const editCard = document.getElementById('edit-card');
const editId = document.getElementById('edit-id');
const editWord = document.getElementById('edit-word');
const editChineseDef = document.getElementById('edit-chinese-def');
const editEnglishDef = document.getElementById('edit-english-def');
const editExample = document.getElementById('edit-example');
const editForm = document.getElementById('edit-form');
const closeEditCard = document.getElementById('close-edit-card');
const cancelEdit = document.getElementById('cancel-edit');
const deleteSelectedBtn = document.getElementById('delete-selected-btn');
const selectAllCheckbox = document.getElementById('select-all');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
const notificationIcon = document.getElementById('notification-icon');

// 渲染单词列表
function renderWordList(words) {
    wordList.innerHTML = '';

    if (words.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" class="text-center py-10 text-gray-500">
                暂无单词数据
            </td>
        `;
        wordList.appendChild(emptyRow);
        return;
    }

    words.forEach(word => {
        const row = document.createElement('tr');
        row.className = 'word-item';
        row.innerHTML = `
            <td>
                <label class="checkbox-container">
                    <input type="checkbox" class="word-checkbox" data-id="${word.id}">
                    <span class="checkbox-custom"></span>
                </label>
            </td>
            <td><span class="word-id">${word.id}</span></td>
            <td><span class="word-text">${word.word}</span></td>
            <td>${word.chineseDef}</td>
            <td>${word.englishDef}</td>
            <td>${word.example}</td>
            <td>
                <button class="edit-btn" data-id="${word.id}">
                    <i class="fa fa-pencil"></i>
                </button>
            </td>
        `;
        wordList.appendChild(row);
    });

    // 添加事件监听器
    setupEventListeners();
}

// 设置事件监听器
function setupEventListeners() {
    // 编辑按钮点击事件
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const word = mockWords.find(w => w.id === id);

            if (word) {
                openEditCard(word);
            }
        });
    });



    // 单词复选框点击事件
    document.querySelectorAll('.word-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });
}

// 更新选中的单词数量
function updateSelectedCount() {
    const checkedCount = document.querySelectorAll('.word-checkbox:checked').length;
    deleteSelectedBtn.disabled = checkedCount === 0;

    if (checkedCount > 0) {
        deleteSelectedBtn.classList.add('active');
    } else {
        deleteSelectedBtn.classList.remove('active');
    }

    // 同步全选复选框状态
    selectAllCheckbox.checked = checkedCount === document.querySelectorAll('.word-checkbox').length;
}

// 全选/取消全选
selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('.word-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    updateSelectedCount();
});

// 删除所选单词
deleteSelectedBtn.addEventListener('click', () => {
    const checkedIds = Array.from(document.querySelectorAll('.word-checkbox:checked'))
        .map(checkbox => parseInt(checkbox.dataset.id));

    if (checkedIds.length > 0) {
        // 确认删除
        if (confirm(`确定要删除选中的 ${checkedIds.length} 个单词吗？`)) {
            // 从模拟数据中删除
            mockWords = mockWords.filter(word => !checkedIds.includes(word.id));
            // 重新渲染列表
            renderWordList(mockWords);
            // 显示成功通知
            showNotification('删除成功', 'success');
        }
    }
});

// 打开编辑卡片
function openEditCard(word) {
    editId.value = word.id;
    editWord.value = word.word;
    editChineseDef.value = word.chineseDef;
    editEnglishDef.value = word.englishDef;
    editExample.value = word.example;

    editCard.classList.add('active');
}

// 关闭编辑卡片
function closeEditCardModal() {
    editCard.classList.remove('active');
    // 重置表单
    editForm.reset();
}

// 关闭编辑卡片按钮
closeEditCard.addEventListener('click', closeEditCardModal);
cancelEdit.addEventListener('click', closeEditCardModal);

// 保存编辑
editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = parseInt(editId.value);
    const updatedWord = {
        id,
        word: editWord.value.trim(),
        chineseDef: editChineseDef.value.trim(),
        englishDef: editEnglishDef.value.trim(),
        example: editExample.value.trim()
    };

    // 验证输入
    if (!updatedWord.word) {
        showNotification('英文单词不能为空', 'error');
        return;
    }

    // 更新单词
    const index = mockWords.findIndex(word => word.id === id);
    if (index !== -1) {
        mockWords[index] = updatedWord;
        // 重新渲染列表
        renderWordList(mockWords);
        // 关闭编辑卡片
        closeEditCardModal();
        // 显示成功通知
        showNotification('保存成功', 'success');
    }
});

// 显示通知
function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;

    // 移除之前的类型类
    notification.classList.remove('notification-success', 'notification-error');

    // 添加新的类型类
    if (type === 'success') {
        notification.classList.add('notification-success');
        notificationIcon.className = 'fa fa-check-circle';
    } else {
        notification.classList.add('notification-error');
        notificationIcon.className = 'fa fa-exclamation-circle';
    }

    // 显示通知
    notification.classList.add('active');

    // 3秒后隐藏通知
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// 导入单词按钮点击事件
document.getElementById('import-btn').addEventListener('click', () => {
    // 这里应该打开导入对话框
    alert('导入功能将在后续版本中实现');
});

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    renderWordList(mockWords);
});