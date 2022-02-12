class Station {
    departures = [];

    constructor(name) {
        this.name = name;
    }

    addDeparture(dep) {
        this.departures.push(dep);
    }

    sortDeps() {
        this.departures.sort(this.compare);
    }

    compare(a, b) {
        if(a.time.minutes < b.time.minutes) {
            return -1;
        }
        if(a.time.minutes > b.time.minutes) {
            return 1;
        }
        return 0;
    }
}