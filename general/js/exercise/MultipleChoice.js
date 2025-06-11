import {QuestionController} from "./QuestionController.js";

const TYPE_MULTIPLE_CHOICE = "multiple-choice"

class MultipleChoiceData {

}

export class MultipleChoice extends QuestionController {
    constructor() {
        super(TYPE_MULTIPLE_CHOICE);
    }
}