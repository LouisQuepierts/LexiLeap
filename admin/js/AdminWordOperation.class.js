import { UrlUtils } from "../../UrlUtils.class.js";

export class AdminWordOperation {
    static fetch(offset, limit, consumer) {
        UrlUtils.post("admin", "word/fetch", "include", {
            offset: offset,
            limit: limit
        })
            .then(response => response.json())
            .then(json => consumer(json.data))
            .catch(error => console.log(error));
    }

    static count() {
        return UrlUtils.get("admin", "word/count", "include")
            .then(response => response.json())
            .then(json => json.data.count) // 提取计数值
            .catch(error => {
                console.error("获取单词总数失败:", error);
                throw error; // 抛出错误以便调用方处理
            });
    }

    static update(id, spell, definition_cn, definition_en, example_sentence) {
        UrlUtils.post("admin", "word/update", "include", {
            id: id,
            spell: spell,
            definition_cn: definition_cn,
            definition_en: definition_en,
            example_sentence: example_sentence
        })
            .then(response => response())
            .then(data => {
                if (data.success) {
                    alert("修改成功");
                } else {
                    alert("修改失败: " + data.message);
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    static delete(ids) {
        UrlUtils.post("admin", "word/delete", "include", {
            ids: ids
        })
            .then(response => response())
            .then(data => {
                if (data.success) {
                    alert("删除成功");
                } else {
                    alert("删除失败: " + data.message);
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    static upload(words) {
        UrlUtils.post("admin", "word/upload", "include", {
            words: words
        })
            .then(response => response())
            .then(data => {
                if (data.success) {
                    console.log(data.data);
                } else {
                    alert("上传失败: " + data.message);
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
}