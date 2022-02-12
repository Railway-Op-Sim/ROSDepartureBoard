function parseTimetable(ttb, timetable) {
    for(const service of ttb) {
        parseService(service, timetable);
    }
}

function parseService(service, timetable) {
    var evts = service.split(",");
    var data = evts.shift();
    var destination = data.split(";")[1].split(" to ")[1];
    
    for(let i = 0; i < evts.length; i++) {
        var dep = parseEvent(evts[i], evts[i - 1], evts[i + 1], destination);
        if(dep != undefined) {
            timetable.addDeparture(dep[0], dep[1]);
        }
    }
}

function parseEvent(evt, prevEvt, nextEvt, dest) {
    if(prevEvt === undefined || nextEvt === undefined) {
        return undefined
    }
    var eSplit = evt.split(";");
    var pSplit = prevEvt.split(";");
    var nSplit = nextEvt.split(";");
    if(eSplit.length == 2) {
        if(eSplit[1] == "cdt") {
            return undefined;
        } else {
            if(pSplit[1] == "Snt" || pSplit[1] == "Sns" || pSplit[1] == "cdt") {
                if(eSplit[1] == dest) {
                    return undefined;
                } else {
                    return [new Departure(new Time(eSplit[0]), dest), eSplit[1]];
                }
            }
        }
    } else {
        if(eSplit[1] == "Snt" || eSplit[1] == "Sns" || eSplit[1] == "Fns" || eSplit[1] == "Fer") {
            return undefined;
        } else {
            return [new Departure(new Time(eSplit[1]), dest), eSplit[2]];
        }
    }
}