class Timetable {
    stations = []

    constructor(time) {
        this.time = time;
    }

    addDeparture(dep, name) {
        var station = this.getStationIfExists(name);
        if(station != null) {
            station.addDeparture(dep);
            station.sortDeps();
        } else {
            station = new Station(name);
            station.addDeparture(dep);
            this.stations.push(station);
        }
    }

    getStationIfExists(station) {
        for(let i = 0; i < this.stations.length; i++) {
            if(this.stations[i].name == station) {
                return this.stations[i];
            }
        }
        return null;
    }

    getNextDepartures(station, time, number) {
        return this.getStationIfExists(station).getNextDepartures(time, number);
    }

    getStationNameList() {
        var stationNames = [];
        for(let i = 0; i < this.stations.length; i++) {
            stationNames.push(this.stations[i].name);
        }
        return stationNames;
    }
}