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

    getNextDepartures(time, number) {
        for(let i = 0; i < this.departures.length; i++) {
            if(this.departures[i].time.minutes > time.minutes) {
                var deps = [];
                for(let j = 0; j < number; j++) {
                    deps.push(this.departures[i + j])
                }
                return deps;
            }
        }
    }
}