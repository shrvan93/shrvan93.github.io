import { Todo } from '../class/todo.js';

Vue.component('todo-list', {
    template: `
    <div class="todo-list">
        <h1>{{list_name}}</h1>
        <div class="filters">
            <label>Show done:</label>
            <input type="checkbox" v-model="showDone">
        </div>
        <ul>
            <task
                v-if="showDone || !todo.isDone" 
                v-for="(todo, index) in todos"
                :todo="todo"
                @checked="checkTodo(index)"
                @deleted="deleteTodo(index)">
            </task>
        </ul>
        <div class="new_task">
                Task:
                <input type="text" v-model="task" @keyup.enter="saveTodo">
            <div class="save_task"><button @click="saveTodo">Save item</button></div>
        </div>
    </div>
    `,
    data() {
        return {
            todos: [
                new Todo('Something to do')
            ],
            task: '',
            showDone: true
        }
    },
    props: ['list_name'],
    methods: {
        saveTodo() {
            // adaugam valoarea din task in lista de todo
            this.todos.push(new Todo(this.task));
            // resetam task-ul
            this.task = '';
        },
        checkTodo(index) {
            this.todos[index].switchDone();
        },
        deleteTodo(index) {
            this.todos.splice(index, 1);
        }
    }
});