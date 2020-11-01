import "https://unpkg.com/vue/dist/vue.js"
import "https://unpkg.com/vuex/dist/vuex.js"

class Answer {
    constructor(id, text) {
        this.id = id
        this.text = text
    }
}

class Question {
    constructor(text, answers, correctAnswer) {
        this.text = text
        this.answers = answers
        this.correctAnswer = correctAnswer
        this.answer = null
        this.shuffleAnswers()
    }
    giveAnswer(answer) {
        this.answer = answer
    }
    hasCorrectAnswer() {
        return this.answer === this.correctAnswer
    }
    calculatePoints() {
        if(this.hasCorrectAnswer()) {
            return 1;
        }
        return 0;
    }
    isSelectedAnswer(answer) {
        return this.answer == answer
    }
    shuffleAnswers() {
        this.answers.sort(function() {
            return 0.5 - Math.random();
        });
    }
}

class Quiz {
    constructor(questions) {
        this.questions = questions
        this.activeQuestion = 0
        this.finished = false
    }
    answerQuestion(answer) {
        if (this.finished) {
            return;
        }
        this.questions[this.activeQuestion].giveAnswer(answer)
    }
    next() {
        if (this.isLastQuestion()) {
            this.finish()
        } else {
            this.activeQuestion++
        }
    }
    back() {
        if (this.activeQuestion > 0) {
            this.activeQuestion--
        }
    }
    isLastQuestion() {
        return this.activeQuestion == this.questions.length - 1
    }
    finish() {
        this.finished = true
    }
    calculateScore() {
        return this.questions.reduce(
            (score, question) => score + question.calculatePoints(),
            0
        )
    }
    getActiveQuestion() {
        return this.questions[this.activeQuestion]
    }
}

const store = new Vuex.Store({
    state: {
        quiz: new Quiz(
            [
                new Question(
                    'Cati litri de apa e bine sa bei pe zi?',
                    [
                        new Answer(1, '1 litru'),
                        new Answer(2, '0.5 litri'),
                        new Answer(3, '2 litri'),
                        new Answer(4, '5 litri')
                    ],
                    3
                ),
                new Question(
                    'Cum se poate modifica starea din Vuex?',
                    [
                        new Answer(1, 'folosind mutatii'),
                        new Answer(2, 'modificand direct proprietatile starii'),
                        new Answer(3, 'apeland direct metoda din mutatations'),
                        new Answer(4, 'starea nu se poate modifica')
                    ],
                    1
                ),
                new Question(
                    'Cum se poate face two-way-binding in Vue?',
                    [
                        new Answer(1, 'folosind atributul v-model'),
                        new Answer(2, 'nu poate face two-way-binding in Vue'),
                        new Answer(3, 'folosind atributul v-data'),
                        new Answer(4, 'folosind v-two-way-binding')
                    ],
                    1
                ),
            ]
        )
    },
    mutations: {
        answerQuestion: (state, answer) => state.quiz.answerQuestion(answer),
        next: (state) => state.quiz.next(),
        back: (state) => state.quiz.back(),
    },
    getters: {
        activeQuestion: (state) => state.quiz.getActiveQuestion(),
        isQuizFinished: (state) => state.quiz.finished,
        quizScore: (state) => state.quiz.calculateScore()
    }
})

const quiz = {
    template: `
        <div>
            <div v-if="isQuizFinished">
                Scorul tau este: {{ quizScore }}
            </div>
            <div v-else>
            <p> {{ activeQuestion.text }} </p>
            <ol>
                <li 
                        v-for="(answer) in activeQuestion.answers"
                        :key="answer.id"
                        @click="answerQuestion(answer.id)"
                        :class="{ selected : activeQuestion.isSelectedAnswer(answer.id) }"
                >
                {{ answer.text }}
                </li>
            </ol>
            <input type="button" @click="back" value="Back"></input>
            <input type="button" @click="next" value="Next"></input>
            </div>
        </div>
    `,
    methods: {
        answerQuestion: (answer) => store.commit('answerQuestion', answer),
        next: () => store.commit('next'),
        back: () => store.commit('back')
    },
    computed: {
        activeQuestion: () => store.getters.activeQuestion,
        isQuizFinished: () => store.getters.isQuizFinished,
        quizScore: () => store.getters.quizScore,
    },
}

new Vue({
    el: '#app',
    components: {quiz},
    store,
    template: `
        <quiz></quiz>  
    `
})