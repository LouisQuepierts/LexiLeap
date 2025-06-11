export class Controller {
    enable;

    constructor() {
        if (!window.use_inject) {
            this.toggle(true);
        }
    }

    toggle(enable) {
        this.enable = enable;
    }

    enabled() {
        return this.enable;
    }
}