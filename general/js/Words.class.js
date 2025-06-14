import { UrlUtils } from "../../UrlUtils.class.js";

export class Word {
    id;
    spell;
    definition_cn;
    definition_en;
    example_sentence;
}

export class WordsClass {
    static localWords;
    static sequence = [];
    static pointer = 0;

    static async random(n = 1) {
        await WordsClass.get();

        if (n === 0) {
            return this.localWords[0];
        }

        const word = [];
        for (let i = 0; i < n; i++) {
            word.push(this.localWords[this.sequence[this.pointer]]);
            this.pointer = (this.pointer + 1) % this.localWords.length;
        }

        return word;
    }

    static async random_no_dup(amount, last = null) {
        await WordsClass.get();
        const words = WordsClass.localWords;
        let i = [];
        if (last) {

        }
    }

    static _gen_sequence(min, max) {
        const length = max - min + 1;
        const arr = Array.from({ length: length }, (_, index) => index + min);

        for (let i = length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        this.sequence = arr;
    }

    static async get() {
        if (WordsClass.localWords) {
            return WordsClass.localWords;
        }

        let wordStorage = sessionStorage.getItem('localWords');
        if (wordStorage !== null && wordStorage !== undefined && wordStorage) {
            WordsClass.localWords = JSON.parse(wordStorage);
            console.log('get from sessionStorage');
            console.log(WordsClass.localWords);
            this._gen_sequence(0, WordsClass.localWords.length - 1);
            return WordsClass.localWords;
        } else {
            const words = await WordsClass.fetch();
            console.log(words);
            WordsClass.localWords = words;
            sessionStorage.setItem('localWords', JSON.stringify(words));
            this._gen_sequence(0, WordsClass.localWords.length - 1);
            return WordsClass.localWords;
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