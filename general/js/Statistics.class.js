const LOCAL_STORAGE_KEY = "lexileap-statistics";

export class Statistics {
    capacity;
    pointer = 0;

    exercisesCount = 0;
    totalAccuracy = 0;

    constructor(capacity = 100) {
        this.history = [];
        this.capacity = capacity;

        const item = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (item) {
            const data = JSON.parse(item);
            this.exercisesCount = data.exercisesCount;
            this.totalAccuracy = data.totalAccuracy;
        } else {
            this.exercisesCount = 0;
            this.totalAccuracy = 0;
        }
    }

    push(data) {
        console.log("store data");
        if (this.history.length === this.capacity) {
            this.history[this.pointer] = data;
        } else {
            this.history.push(data);
        }
        this.pointer = (this.pointer + 1) % this.capacity;

        this.exercisesCount++;
        this.totalAccuracy = Math.round(this.totalAccuracy * (this.exercisesCount - 1) / this.exercisesCount + data.accuracy / this.exercisesCount);

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            exercisesCount: this.exercisesCount,
            totalAccuracy: this.totalAccuracy
        }));
    }

    peek(shift = 0) {
        if (this.history.length === 0 || shift >= this.history.length) {
            return null;
        }
        return this.history[(this.pointer - shift - 1 + this.capacity) % this.capacity];
    }

    static getInstance() {
        return instance;
    }
}

const instance = new Statistics(100);