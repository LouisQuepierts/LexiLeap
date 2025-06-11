export class PageInjector {
    destID;
    srcSubfix;
    mapping;

    container;
    current;

    constructor(destID, srcID, document) {
        this.destID = destID;
        this.srcSubfix = srcID;
        this.container = document.getElementById(this.destID);

        this.mapping = [];
    }

    async load(name, page, callback) {
        await this._load(name, page, false, callback)
    }

    async _load(name, page, show, callback) {
        window.use_inject = true;
        await fetch(page)
            .then(res => res.text())
            .then(async data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const element = doc.getElementById(name + this.srcSubfix);

                if (element) {
                    const div = document.createElement('div');
                    div.id = name;
                    div.innerHTML = element.innerHTML;
                    this.container.appendChild(div);

                    await Promise.all([
                        this.loadStyles(doc),
                        this.loadScripts(doc)
                    ]);

                    this.mapping[name] = {
                        element: div,
                        controller: window.child_controller[name]
                    };

                    callback(this.mapping[name]);
                    console.log(`Loaded page: ${name}`);

                    if (show) {
                        window.child_controller.toggle(true);
                    } else {
                        div.classList.add('hidden')
                    }
                }
            })
            .catch(err => console.error(err));
    }

    inject(name) {
        if (this.current) {
            this.current.element.classList.add('hidden');
            this.current.controller.toggle(false);
        }

        const page = this.mapping[name];
        page.element.classList.remove('hidden');
        page.controller.toggle(true);
        this.current = page;
    }

    async loadStyles(doc) {
        const styles = Array.from(doc.querySelectorAll('style, link[rel="stylesheet"]'));
        const stylePromises = styles.map(style => {
            return new Promise((resolve, reject) => {
                try {
                    if (style.tagName === 'STYLE') {
                        // 内联样式直接添加
                        this.container.appendChild(style.cloneNode(true));
                        resolve();
                    } else {
                        // 外部样式表需要等待加载完成
                        const newLink = document.createElement('link');
                        newLink.rel = 'stylesheet';
                        newLink.href = style.href;
                        newLink.onload = resolve;
                        newLink.onerror = reject;
                        document.head.appendChild(newLink);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        return Promise.all(stylePromises);
    }

    async loadScripts(doc) {
        const scripts = Array.from(doc.querySelectorAll('script'));
        const scriptPromises = scripts.map(script => {
            return new Promise((resolve, reject) => {
                try {
                    const newScript = document.createElement('script');
                    Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });

                    // 处理模块脚本
                    if (script.type === 'module') {
                        newScript.onload = resolve;
                        newScript.onerror = reject;
                    } else {
                        // 普通脚本需要手动执行
                        newScript.textContent = script.textContent;
                        resolve(); // 普通脚本立即执行，无需等待
                    }

                    document.body.appendChild(newScript);
                } catch (e) {
                    reject(e);
                }
            });
        });

        return Promise.all(scriptPromises);
    }
}