function parseTimetable(ttb, timetable) {
    for(const service of ttb) {
        parseService(service, timetable);
    }
}

function parseService(service, timetable) {
    var evts = service.split(",");
    var data = evts.shift();
    
    for(let i = 0; i < evts.length; i++) {
        if(data.startsWith("*") || data.startsWith(" ") || data == "") {
            break;
        }
        repeats = hasRepeat(evts);
        var destination = getDestination(data);
        var dep = parseEvent(evts[i], evts[i - 1], evts[i + 1], destination);
        if(dep != undefined) {
            timetable.addDeparture(dep[0], dep[1]);
            if(repeats[0] == true) {
                tm = dep[0].time;
                for(let j = 0; j < repeats[3]; j++) {
                    tm = tm.addMinsGetNew(parseInt(repeats[1]));
                    timetable.addDeparture(new Departure(tm, dep[0].destination), dep[1]);
                }
            }
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
    } else if(eSplit.length == 3) {
        if(eSplit[1] == "Snt" || eSplit[1] == "Sns" || eSplit[1] == "Fns" || eSplit[1] == "Fer" || eSplit[1] == "Sfs" || eSplit[1] == "Sns-fsh" || 
        eSplit[1] == "pas" || eSplit[1] == "jbo" || eSplit[1] == "fsp" || eSplit[1] == "rsp" || eSplit[1] == "Fjo" || eSplit[1] == "Frh-sh" || eSplit[1] == "F-nshs") {
            return undefined;
        } else {
            return [new Departure(new Time(eSplit[1]), dest), eSplit[2]];
        }
    } else {
        return undefined;
    }
}

function getDestination(data) {
    console.log(data)
    var desc = data.split(";")[1];
    desc = desc.replace(/\([\s\S]*?\)/g, "");
    if(desc.split(" to ")[1] != undefined) {
        return desc.split(" to ")[1];
    } else if(desc.split(" - ")[1] != undefined) {
        return desc.split(" - ")[1];
    } else if(desc.split("-")[1] != undefined) {
        return desc.split("-")[1];
    } else {
        return desc;
    }
}

function hasRepeat(evts) {
    last = evts.slice(-1)[0];
    lastarr = last.split(";");
    if(lastarr[0] == "R") {
        return [true, lastarr[1], lastarr[2], lastarr[3]];
    } else {
        return [false];
    }
}