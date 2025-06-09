import { UrlUtils } from "../../url_utils.js";

export class Words {
    static localWords;

    static async get() {
        let wordStorage = sessionStorage.getItem('localWords');
        if (wordStorage !== null && wordStorage !== undefined && wordStorage) {
            Words.localWords = JSON.parse(wordStorage);
            console.log('get from sessionStorage');
            console.log(Words.localWords);
            return Words.localWords;
        } else {
            // 从网络获取数据（异步操作）
            const words = await Words.fetch();
            console.log(words);
            Words.localWords = words;
            sessionStorage.setItem('localWords', JSON.stringify(words));
            return Words.localWords;
        }
    }

    static async fetch() {
        try {
            const response = await UrlUtils.post("general", "word/fetch", "include", {
                "offset": 0,
                "limit": 20
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.data.words;
        } catch (error) {
            console.error('Error fetching words:', error);
            throw error; // 将错误继续抛出，让调用者处理
        }
    }
}