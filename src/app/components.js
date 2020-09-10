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
        <v-textarea outlined v-model="dayStatus.notes" label="Notes" :rows=2></v-textarea>

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
                todos: this.status.todos,
                notes: this.status.notes
            }
        };
    },
    methods: {
        onSubmit() {
            let statusUpdated = {
                date: this.status.date,
                goals: this.dayStatus.goals,
                completedTasks: this.dayStatus.completedTasks,
                todos: this.dayStatus.todos,
                notes: this.dayStatus.notes
            };
            this.$emit('status-updated', statusUpdated);
            this.dayStatus = {
                goals: null,
                completedTasks: null,
                todos: null,
                notes: null
            };
        },
        onCancel() {
            this.$emit('status-update-cancelled');
        },

        clickSave(e) {
            if (!(e.keyCode === 83 && e.ctrlKey)) {
              return;
            }
      
            e.preventDefault();
            this.onSubmit();
        },
    },
    watch: {
        status(newValue) {
            this.dayStatus.date = newValue.date,
            this.dayStatus.goals = newValue.goals,
            this.dayStatus.completedTasks = newValue.completedTasks,
            this.dayStatus.todos = newValue.todos,
            this.dayStatus.notes = newValue.notes
        }
    },
    mounted() {
        document.addEventListener("keydown", this.clickSave);
      },
    
    beforeDestroy() {
        document.removeEventListener("keydown", this.clickSave);
    },
});

Vue.component('status-list', {
    props: {
        statuses: Array
    },
    data: {
        selectedStatus: null
    },
    template: `
<div>
    <v-card class="mx-auto" max-width="900" tile>
        <v-list shaped dense>
        <v-subheader>Statuses</v-subheader>
            <v-list-item-group color="primary">
                <v-list-item v-for="(item, index) in statuses" :key="item.date" @click="selectStatus(index)">
                    <v-list-item-icon class="d-none d-sm-block">
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
            if (this.selectedStatus === this.statuses[index]) {
                this.selectedStatus = null;
            } else {
                this.selectedStatus = this.statuses[index];
            }

            this.$emit('status-selected', this.selectedStatus);
        }
    }
});