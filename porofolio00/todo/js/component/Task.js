Vue.component('task', {
    template: `
        <li :class="{ done: todo.isDone }" class="task" @click="$emit('checked')">  
            <div class="color_and_title">
                <div class="color" :style="{backgroundColor: todo.color}"></div>
                <div class="title">{{ todo.title }}</div>
            </div>
            <div class="controls">
                <div class="delete" @click="$emit('deleted')">
                <i class="fa fa-trash"></i>
                </div>
            </div>
        </li>
    `,
    props: ['todo']
});