import {UrlUtils} from "../../UrlUtils.class.js";
import {Statistics} from "../../general/js/Statistics.class.js";

document.addEventListener('DOMContentLoaded', function() {
    const userdata = sessionStorage.getItem('userdata');
    const statistics = Statistics.getInstance();

    console.log(statistics);

    if (!!userdata) {
        console.log("person2: " + userdata)
        window.userdata = JSON.parse(userdata);
        // 模拟用户数据
        const userData = {
            username: window.userdata.username,
            id: window.userdata.uid,
            email: window.userdata.email,
            avatar: window.userdata.avatar,
            exercisesCount: statistics.exercisesCount,
            accuracyRate: statistics.totalAccuracy
        };

        initializeUserData(userData);
    } else {
        window.addEventListener('userdata-loaded', (event) => {
            const userData = {
                username: event.detail.username,
                email: event.detail.email,
                uid: event.detail.uid,
                avatar: event.detail.avatar,
                exercisesCount: statistics.exercisesCount,
                accuracyRate: statistics.totalAccuracy
            };
            initializeUserData(userData);
        })
    }

    // 初始化页面数据

    // 设置事件监听器
    setupEventListeners();

    // 初始化用户数据显示
    function initializeUserData(user) {
        document.getElementById('display-name').textContent = user.username; // 注意这里修改了ID
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('user-avatar').src = user.avatar;
        document.getElementById('user-id').textContent = user.uid;

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
            const newEmail = document.getElementById('email').value;

            UrlUtils.post('user', 'update-profile', 'include', {
                username: newUsername,
                email: newEmail
            }).then(res => {
                if (res.status === 200) {
                    alert('个人资料修改成功！');
                    document.getElementById('display-name').textContent = newUsername;
                } else {
                    alert(res.message);
                }
            });
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

            UrlUtils.post('user', 'update-password', 'include', {
                oldPassword: currentPassword,
                newPassword: newPassword
            }).then(response => {
                document.getElementById('password-form').reset();
                return response.json();
            }).then(data => {
                if (data.success) {
                    showNotification('密码修改成功！', 'success');
                } else {
                    showNotification('密码修改失败！', 'error');
                }
            })

        });

        // 头像上传
        document.getElementById('avatar-upload').addEventListener('change', function(e) {
            const updateFile = this.files[0];
            if (this.files && updateFile) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const image = new Image();
                    image.onload = function () {
                        const width = image.width;
                        const height = image.height;

                        if (width < 128 || height < 128 || width > 1024 || height > 1024) {
                            alert("图片尺寸不符合要求");
                            return;
                        }

                        UrlUtils.upload('user', 'upload-avatar', updateFile, function (success, res) {
                            if (success && res.success) {
                                alert("上传成功");
                                const url = res.data.url;
                                document.getElementById('user-avatar').src = url;
                                window.userdata.avatar = url;
                                sessionStorage.setItem('userdata', JSON.stringify(window.userdata));
                                const event = new CustomEvent('userdata-loaded', { detail: window.userdata });
                                window.dispatchEvent(event);
                            } else {
                                alert("上传失败");
                            }
                        });
                    }
                    image.src = e.target.result;
                }

                reader.readAsDataURL(updateFile);
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