// 模拟数据 - 在实际应用中，这部分应该从API获取
import {Words} from "../../general/js/Words.js";
import {AdminWordOperation} from "./AdminWordOperation.class.js";

let mockWords;

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

// 新增：分页相关变量
let currentPage = 1;
const pageSize = 20; // 每页显示的单词数量

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
            <td><span class="word-text">${word.spell}</span></td>
            <td>${word.definition_cn}</td>
            <td>${word.definition_en}</td>
            <td>${word.example_sentence}</td>
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

// 新增：渲染分页按钮
function renderPagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) {
        console.error('分页容器未找到，请检查HTML结构');
        return;
    }

    paginationContainer.innerHTML = ''; // 清空现有分页按钮

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-btn');
        if (i === currentPage) {
            button.classList.add('active'); // 当前页高亮
        }
        button.addEventListener('click', () => {
            currentPage = i;
            loadWords(); // 切换页面时重新加载数据
        });
        paginationContainer.appendChild(button);
    }
}

// 新增：加载单词数据并支持分页
function loadWords() {
    
    // 获取总词数
    AdminWordOperation.count()
        .then(totalWords => {
            // 计算总页数
            const totalPages = Math.ceil(totalWords / pageSize);
            const page = Math.min(totalPages, currentPage);
            const offset = (page - 1) * pageSize;
            
            // 渲染分页按钮
            renderPagination(totalPages);

            // 动态获取指定页的数据
            AdminWordOperation.fetch(offset, pageSize, (data) => {
                mockWords = data.words;
                renderWordList(mockWords);
            });
        })
        .catch(error => {
            console.error("获取总词数失败:", error);
            showNotification('获取总词数失败', 'error');
        });
}

//导入文件
document.getElementById('import-btn').addEventListener('click', () => {
    // 触发隐藏的文件输入框
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];

    // 验证文件类型
    if (!file.name.endsWith('.json')) {
        alert('请选择.json格式的文件');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const words = JSON.parse(e.target.result);
        AdminWordOperation.upload(words, () => {
            loadWords();
        });

        // 重置文件输入，允许重复选择同一文件
        event.target.value = '';
    };

    reader.onerror = () => {
        alert('文件读取失败');
    };

    reader.readAsText(file);
});

// 设置事件监听器
function setupEventListeners() {
    // 编辑按钮点击事件
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const word = mockWords.find(w => w.id === id);
            console.log(mockWords)

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
            // const selected = mockWords.filter(word => !checkedIds.includes(word.id));
            console.log(checkedIds);
            AdminWordOperation.delete(checkedIds, () => {
                loadWords();
            });
            // 重新渲染列表
            // renderWordList(mockWords);
            // 显示成功通知
            showNotification('删除成功', 'success');
        }
    }
});

// 打开编辑卡片
function openEditCard(word) {
    console.log(word);
    editId.value = word.id;
    editWord.value = word.spell;
    editChineseDef.value = word.definition_cn;
    editEnglishDef.value = word.definition_en;
    editExample.value = word.example_sentence;

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
        id: id,
        spell: editWord.value.trim(),
        definition_cn: editChineseDef.value.trim(),
        definition_en: editEnglishDef.value.trim(),
        example_sentence: editExample.value.trim()
    };

    console.log(updatedWord)

    if (updatedWord.spell === '') {
        alert('请输入单词');
        return;
    }

    closeEditCardModal();
    AdminWordOperation.update(id, updatedWord.spell, updatedWord.definition_cn, updatedWord.definition_en, updatedWord.example_sentence, () => {
        loadWords();
        showNotification('更新成功', 'success');
    });
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

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 使用分页加载数据
    loadWords();
});
