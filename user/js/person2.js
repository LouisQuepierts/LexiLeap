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
            uid: window.userdata.uid,
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
                            // 上传回调处理
                            if (success && res.success) {
                                alert("上传成功");
                                const url = res.data.url;//更新头像
                                document.getElementById('user-avatar').src = url;
                                window.userdata.avatar = url;
                                sessionStorage.setItem('userdata', JSON.stringify(window.userdata));//将更新后的用户数据存入 sessionStorage，防止页面刷新后数据丢失。从全局变量 window.userdata 中获取当前用户信息（如头像 URL、用户名等）。序列化为 JSON：将对象转换为字符串，确保数据结构完整。存入 sessionStorage：以 userdata 为键，存储序列化后的字符串。
                                const event = new CustomEvent('userdata-loaded', { detail: window.userdata });//触发事件 userdata-loaded，携带更新后的用户数据，通知导航栏更新头像。
                                window.dispatchEvent(event);
                            } else {
                                alert("上传失败");
                            }
                        });
                    }
                    image.src = e.target.result;//设置为读取的结果
                }

                reader.readAsDataURL(updateFile);//将文件转换为 DataURL 格式（Base64 编码），用于前端预览。
            }
        });

        // 添加标签页切换逻辑
        const tabButtons = document.querySelectorAll('.tab-btn');//为每个标签页按钮添加点击事件监听器。
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有标签页按钮的活动状态 确保同一时间只有一个按钮处于激活状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // 激活当前按钮
                button.classList.add('active');

                // 隐藏所有标签页内容
                const tabPanes = document.querySelectorAll('.tab-pane');
                tabPanes.forEach(pane => pane.classList.remove('active'));

                const tabId = button.getAttribute('data-tab');//从按钮的 data-tab 属性获取目标标签页的 ID
                document.getElementById(tabId).classList.add('active');//通过 ID 找到对应的内容面板，并添加 active 类以显示它。
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