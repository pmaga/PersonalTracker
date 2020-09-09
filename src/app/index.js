Vue.component('status-edit', {
    props: {
        status: Object
    },
    template: `
<div>
    <v-form ref="form">
        <v-textarea outlined v-model="dayStatus.goals" label="Goals" :rows=4></v-textarea>
        <v-textarea outlined v-model="dayStatus.completedTasks" label="Completed tasks" :rows=4></v-textarea>
        <v-textarea outlined v-model="dayStatus.todos" label="Todo" :rows=4></v-textarea>

        <v-btn color="green" class="ma-2 white--text" @click="onSubmit">
            Save 
            <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn color="red" class="ma-2 white--text" @click="onCancel">
            Cancel 
        </v-btn>
    </v-form>
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
    <v-card class="mx-auto" max-width="900" tile>
        <v-list shaped dense>
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
</div>
    `,
    methods: {
        selectStatus(index) {
            this.$emit('status-selected', this.statuses[index]);
        }
    }
});

var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        selectedStatus: null,
        statuses: [],
        cacheKey: `statuses_${moment().month() + 1}`,
        today: moment()
    },

    mounted() {
        var item = localStorage.getItem(this.cacheKey);
        if (item) {
            try {
                this.statuses = JSON.parse(item);
            } catch(ex) {
                localStorage.removeItem(this.cacheKey);
            }
        } else {
            this.statuses = [];
        }
    },

    computed: {
        lastStatus() {
            return this.statuses[this.statuses.length - 1];
        }
    },

    methods: {
        selectStatus(status) {
            console.log(status);
            this.selectedStatus = status;
        },
        updateStatus(status) {
            const idx = this.statuses.findIndex(element => element.date === status.date);

            if (idx === -1) {
                this.addStatus(status);
            }
            else {
                Vue.set(this.statuses, idx, status);
            }

            this.selectedStatus = null;
            this.persistState();
        },
        addStatus(status) {
            this.statuses.push(status);
            this.persistState();
        },
        createAndSelectNewStatus() {
            const todayFormat = this.today.format("DD-MM-YYYY");

            if (this.lastStatus && this.lastStatus.date === todayFormat) {
                this.selectStatus = this.lastStatus;
            } else {
                var newStatus = {
                    date: todayFormat
                };
                if (this.lastStatus)
                {
                    newStatus.goals = this.lastStatus.todos;
                }

                this.addStatus(newStatus);
                this.selectedStatus = newStatus;
            }
        },
        canAddNewStatus() {
            return !this.lastStatus || this.lastStatus.date !== this.today.format("DD-MM-YYYY");
        },
        persistState() {
            const parsed = JSON.stringify(this.statuses);
            localStorage.setItem(this.cacheKey, parsed);
        }
    }
});