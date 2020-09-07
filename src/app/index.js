Vue.component('status-edit', {
    props: {
        status: Object
    },
    template: `
<div>
    <template>
        <v-form ref="form">
            <v-textarea outlined v-model="dayStatus.goals" label="Goals" :rows=4 required></v-textarea>
            <v-textarea outlined v-model="dayStatus.completedTasks" label="Completed tasks" :rows=4 required></v-textarea>
            <v-textarea outlined v-model="dayStatus.todos" label="Todo" :rows=4 required></v-textarea>

            <v-btn color="green" class="ma-2 white--text" @click="onSubmit">
                Save 
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn color="red" class="ma-2 white--text" @click="onCancel">
                Cancel 
            </v-btn>
        </v-form>
    </template>
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
        },
        onCancel() {
            this.$emit('status-update-cancelled');
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
        <template>
            <v-card class="mx-auto" max-width="900" tile>
                <v-list shaped>
                <v-subheader>Statuses</v-subheader>
                    <v-list-item-group color="primary">
                        <v-list-item v-for="(item, index) in statuses" :key="item.date" @click="selectStatus(index)">
                            <v-list-item-icon>
                                <v-icon>mdi-calendar-plus</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.date"></v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </template>
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
    vuetify: new Vuetify(),
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

            this.selectedStatus = null;
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