document.addEventListener('DOMContentLoaded', function() {
    // 模拟用户数据
    const userData = {
        username: 'lexileaper',
        email: 'lexileaper@example.com',
        bio: '热爱学习新单词的语言爱好者',
        avatar: 'https://picsum.photos/200/200?random=1',
        exercisesCount: 56,
        accuracyRate: 82
    };

    // 初始化页面数据
    initializeUserData(userData);

    // 设置事件监听器
    setupEventListeners();

    // 初始化用户数据显示
    function initializeUserData(user) {
        document.getElementById('display-name').textContent = user.username; // 注意这里修改了ID
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('user-avatar').src = user.avatar;

        // 设置练习统计数据
        document.getElementById('total-exercises').textContent = user.exercisesCount; // 注意这里修改了ID
        document.getElementById('correct-rate').textContent = `${user.accuracyRate}%`;
        // 设置进度条
        }

    // 设置事件监听器
    function setupEventListeners() {
        // 保存个人资料修改
        document.getElementById('save-profile').addEventListener('click', function() {
            const newUsername = document.getElementById('username').value;
            const newBio = document.getElementById('bio').value;

            // 更新显示
            document.getElementById('username-display').textContent = newUsername;

            // 显示成功消息
            showNotification('个人资料已更新', 'success');
        });

        // 修改密码
        document.getElementById('save-password').addEventListener('click', function() {
            const currentPassword = document.getElementById('old-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // 简单验证
            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('请填写所有密码字段', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showNotification('新密码和确认密码不匹配', 'error');
                return;
            }

            // 模拟密码修改成功
            document.getElementById('password-form').reset();
            showNotification('密码已成功修改', 'success');
        });

        // 头像上传
        document.getElementById('avatar-upload').addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    document.getElementById('user-avatar').src = e.target.result;
                    showNotification('头像已更新', 'success');
                }

                reader.readAsDataURL(this.files[0]);
            }
        });
        // 添加标签页切换逻辑
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有标签页按钮的活动状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // 给当前点击的按钮添加活动状态
                button.classList.add('active');

                // 隐藏所有标签页内容
                const tabPanes = document.querySelectorAll('.tab-pane');
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // 显示对应的标签页内容
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // 显示通知消息
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg transform transition-all duration-500 ease-in-out z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
                type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        // 添加到页面
        document.body.appendChild(notification);

        // 动画效果
        setTimeout(() => {
            notification.classList.add('translate-y-0');
        }, 10);

        // 自动关闭
        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-y-[-20px]');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
});