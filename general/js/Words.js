import { UrlUtils } from "../../url_utils.js";

export class Word {
    id;
    spell;
    definition_cn;
    definition_en;
    example_sentence;
}

export class Words {
    static localWords;

    static async random(last = null) {
        await Words.get();
        let word = Words.localWords[Math.floor(Math.random() * Words.localWords.length)];
        if (last) {
            while (last === word) {
                word = Words.localWords[Math.floor(Math.random() * Words.localWords.length)];
            }
        }

        return word;
    }

    static async get() {
        if (Words.localWords) {
            return Words.localWords;
        }

        let wordStorage = sessionStorage.getItem('localWords');
        if (wordStorage !== null && wordStorage !== undefined && wordStorage) {
            Words.localWords = JSON.parse(wordStorage);
            console.log('get from sessionStorage');
            console.log(Words.localWords);
            return Words.localWords;
        } else {
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
                "limit": 100
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.data.words;
        } catch (error) {
            console.error('Error fetching words:', error);
        }
    }
}