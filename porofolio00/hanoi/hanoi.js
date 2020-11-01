import 'http://unpkg.com/vue/dist/vue.js'
import 'http://unpkg.com/vuex/dist/vuex.js'

function randomColor() {
    return '#' + Math.random().toString(16).substr(-6);
}

class Move {
    constructor(sourceRodId, targetRodId) {
        this.sourceRodId = sourceRodId
        this.targetRodId = targetRodId
    }
}

class Disk {
    constructor(size) {
        this.size = size
        this.color = randomColor()
    }
    biggerThan(anotherDisk) {
        return this.size > anotherDisk.size
    }
}

class Rod {
    constructor(id, numberOfDisks, size) {
        this.id = id
        this.size = size
        this.disks = []
        this.createDisks(numberOfDisks)
    }
    createDisks(numberOfDisks) {
        for(let size=numberOfDisks; size>0; size--) {
            this.disks.push(new Disk(size))
        }
    }
    put(disk) {
        if (!this.canPutDisk(disk)) throw new Error('Cannot put disk')
        this.disks.push(disk)
    }
    canPutDisk(disk) {
        return this.isEmpty()
            || this.topDisk().biggerThan(disk)
    }
    pop() {
        if (this.isEmpty()) throw new Error('Rod is empty')
        return this.disks.pop()
    }
    isEmpty() {
        return this.disks.length == 0
    }
    topDisk() {
        return this.disks[this.disks.length - 1]
    }
}

class Game {
    constructor(numberOfDisks) {
        this.rods = {
            A: new Rod('A', numberOfDisks, numberOfDisks),
            B: new Rod('B', 0, numberOfDisks),
            C: new Rod('C', 0, numberOfDisks)
        }
        this.numberOfMoves = 0
    }
    makeMove(move) {
        console.log(move)
        let sourceRod = this.rods[move.sourceRodId]
        let targetRod = this.rods[move.targetRodId]
        if (!targetRod.canPutDisk(sourceRod.topDisk())) {
            throw new Error('Cannot move disk')
        }
        let disk = sourceRod.pop()
        targetRod.put(disk)
    }
}

const store = new Vuex.Store({
    state: {
        game: new Game(4)
    },
    mutations: {
       makeMove: (state, move) => state.game.makeMove(move) 
    }
})

const rod = {
    props: ['rod'],
    template: `
        <div class="rod"
             :style="{ height: disksHeight(rod.size), width: diskWidth(rod.size) }"
             @dragover.prevent
             @dragenter.prevent
             @drop="drop($event, rod)"
        >
            <div v-for="disk in rod.disks"
                 :key="disk.size"
                 class="disk"
                 :style="{ 
                     height: disksHeight(1),
                     width: diskWidth(disk.size),
                     backgroundColor: disk.color
                 }"
                 draggable="true"
                 @dragstart="drag($event, rod)"
            >
            </div>
        </div>
    `,
    methods: {
        disksHeight: (disks) => disks * 2 + 'em',
        diskWidth: (diskSize) => diskSize * 3 + 'em',
        drag: (event, dragRod) => {
            event.dataTransfer.setData("dragRodId", dragRod.id)
        },
        drop: (event, dropRod) => {
            const dragRodId = event.dataTransfer.getData("dragRodId")
            store.commit('makeMove', new Move(dragRodId, dropRod.id))
        }
    }, 
}

const game = {
    template: `
        <div class="game">
            <rod v-for="rod in rods" :rod="rod" :key="rod.id"></rod>
        </div>
    `,
    computed: {
        rods: () => store.state.game.rods
    },
    components: {rod}
}

new Vue({
    el: '#app',
    store,
    components: {rod, game},
    template: `<game></game>`
})