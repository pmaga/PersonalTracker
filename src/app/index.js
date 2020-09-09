var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        selectedStatus: null,
        statuses: [],
        cacheKey: `statuses_${new Date().getMonth() + 1}`,
        today: new Date()
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
        },
        todayFormatted() {
            return this.formatDate(this.today);
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
            if (this.lastStatus && this.lastStatus.date === this.todayFormatted) {
                this.selectStatus = this.lastStatus;
            } else {
                var newStatus = {
                    date: this.todayFormatted
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
            return !this.lastStatus || this.lastStatus.date !== this.todayFormatted;
        },
        persistState() {
            const parsed = JSON.stringify(this.statuses);
            localStorage.setItem(this.cacheKey, parsed);
        },
        formatDate(date) {
            var day = date.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            var month = date.getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            return `${day}-${month}-${date.getFullYear()}`
        }
    }
});