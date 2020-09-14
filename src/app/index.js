var app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth() + 1;
        return {
            selectedStatus: null,
            statuses: [],
            currentMonth: currentMonth,
            cacheKey: `statuses_${currentMonth}`,
            today: currentDate
        };
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
        cols () {
            const { xs, sm } = this.$vuetify.breakpoint
            if (xs) return [5, 7];
            if (sm) return [4, 8];
            return [3, 9];
        },
        lastStatus() {
            return this.statuses[this.statuses.length - 1];
        },
        todayFormatted() {
            return this.formatDate(this.today);
        },
        localMonthAndYear() {
            return this.today.toLocaleString('default', { month: 'long' }) + ' ' + this.today.getFullYear();
        }
    },

    methods: {
        selectStatus(status) {
            this.selectedStatus = status;
        },
        updateStatus(status, unselectStatus) {
            const idx = this.statuses.findIndex(element => element.date === status.date);

            if (idx === -1) {
                this.addStatus(status);
            }
            else {
                Vue.set(this.statuses, idx, status);
            }

            if (unselectStatus) {
                this.selectedStatus = null;
            }
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