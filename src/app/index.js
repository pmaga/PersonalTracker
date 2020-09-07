Vue.component('status-edit', {
    props: {
        status: Object
    },
    template: `
<div>
    <form class="edit-form" @submit.prevent="onSubmit">
        <p>Date: {{ status.date }} </p>
        <p>
            <label for="goals">Goals</label> 
            <textarea cols="30" rows="4" v-model="dayStatus.goals"></textarea>
        </p>

        <p>
            <label for="completedTasks">Completed tasks</label> 
            <textarea cols="30" rows="4" v-model="dayStatus.completedTasks"></textarea>
        </p>

        <p>
            <label for="todo">Todo</label> 
            <textarea cols="30" rows="4" v-model="dayStatus.todos"></textarea>
        </p>

        <p>
            <input type="submit" value="Save" />
        </p>
    </form>
</div>`,
    data() { 
        return {
            dayStatus: { 
                goals: this.status.goals,
                completedTasks: this.status.completedTasks,
                todos: this.status.todos
            }
        };
    },
    methods: {
        onSubmit() {
            let statusUpdated = {
                date: this.status.date,
                goals: this.dayStatus.goals,
                completedTasks: this.dayStatus.completedTasks,
                todos: this.dayStatus.todos
            };
            this.$emit('status-updated', statusUpdated);
            this.dayStatus = {
                goals: null,
                completedTasks: null,
                todos: null
            };
        }
    },
    watch: {
        status(newValue) {
            this.dayStatus.goals = newValue.goals,
            this.dayStatus.completedTasks = newValue.completedTasks,
            this.dayStatus.todos = newValue.todos
        }
    }
});

Vue.component('status-list', {
    props: {
        statuses: Array
    },
    template: `
    <div>
        <ul>
            <li v-for="(item, index) in statuses" :key="item.date">
                <span>{{ item.date }}</span>
                <span>{{ item.goals }}</span>
                <span>{{ item.completedTasks }}</span>
                <span>{{ item.todos }}</span>
                <button class="button-edit-status" @click="selectStatus(index)"></button>
            </li>
        </ul>
    </div>
    `,
    methods: {
        selectStatus(index) {
            this.$emit('status-selected', this.statuses[index]);
        },
        editStatus(index, status) {
            this.statuses[index] = status;
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        selectedStatus: null,
        statuses: [
            { date: new Date('2020-09-01').toLocaleDateString(), goals: 'Goals', completedTasks: 'Completed tasks', todos: 'Todos' },
            { date: new Date('2020-09-02').toLocaleDateString(), goals: null, completedTasks: null, todos: null },
            { date: new Date('2020-09-03').toLocaleDateString(), goals: null, completedTasks: null, todos: null },
            { date: new Date('2020-09-04').toLocaleDateString(), goals: null, completedTasks: null, todos: null },
            { date: new Date('2020-09-05').toLocaleDateString(), goals: null, completedTasks: null, todos: null },
            { date: new Date('2020-09-06').toLocaleDateString(), goals: null, completedTasks: null, todos: null },
            { date: new Date('2020-09-07').toLocaleDateString(), goals: null, completedTasks: null, todos: null }
        ]
    },
    methods: {
        statusSelected(status) {
            this.selectedStatus = status;
        },
        statusUpdated(status) {
            const idx = this.statuses.findIndex(element => element.date === status.date);

            if (idx === -1) {
                this.statusAdded(status);
            }
            else {
                Vue.set(this.statuses, idx, status);
            }
        },
        statusAdded(status) {
            console.log(status);
            this.statuses.push(status);
        },
        addStatus() {
            var lastStatus = this.statuses[this.statuses.length - 1];
            var newDate = new Date(lastStatus.date);
            newDate.setDate(newDate.getDate() + 1);
            this.selectedStatus = {
                date: newDate.toLocaleDateString()
            };
        }
    }
});