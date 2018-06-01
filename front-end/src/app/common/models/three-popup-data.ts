export class InputModal {
    title: string;
    type: string;
    name: string;
    value: string;
    constructor(){
    }
}
export class DataModal {
    type: string;
    title: string;
    listInput: InputModal[];
    constructor(){
        this.title = '';
        this.listInput = [];
    }
}