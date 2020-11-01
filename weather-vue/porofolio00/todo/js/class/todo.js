class Todo {
    constructor(title) {
        this.title = title;
        this.isDone = false;
        this.color = this.randomColor();
    }
    switchDone() {
        this.isDone = !this.isDone;
    }
    randomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
}

export { Todo }