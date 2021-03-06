class Time {
    constructor(timeString) {
        var tmArr = timeString.split(":");
        this.minutes = (parseInt(tmArr[0]) * 60) + parseInt(tmArr[1]);
    }

    toString() {
        var hours = parseInt(this.minutes / 60);
        var mins = this.minutes - (hours * 60);
        let hourString = hours.toLocaleString('en-US', {
            minimumIntegerDigits: 2
        });
        let minsString = mins.toLocaleString('en-US', {
            minimumIntegerDigits: 2
        });
        return hourString + ":" + minsString;
    }

    increment() {
        this.minutes++;
    }

    addMinsGetNew(mins) {
        var tm = new Time(this.toString());
        tm.minutes += mins;
        return tm;
    }
}