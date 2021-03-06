var timetable;
var currentTime;
var stations;
var ttbLoaded = false;
var seconds = 0;
var currentStation;

function startClock() {
  function secondClock(){
    if(seconds == 59) {
      seconds = 0;
      currentTime.increment();
      writeToBoards(timetable, currentTime);
    } else {
      seconds++;
    }
    let secondString = seconds.toLocaleString('en-US', {
      minimumIntegerDigits: 2
    });
    $(".time #seconds").text(":" + secondString);
    setTimeout(secondClock, 1000);
  }
  setTimeout(secondClock, 1000);
}

function readLogFile(event) {
  const logFileList = event.target.files;
  var logFile = logFileList[0];
  const reader = new FileReader();
  reader.addEventListener('load', event => {
      var log = event.target.result;
      latestLogArray = log.split(/\r\n/g);
      console.log(latestLogArray);
  });
  reader.readAsText(logFile);
  log = true;
}

function readTimetableFile(event) {
  const ttbFileList = event.target.files;
  var ttbFile = ttbFileList[0];
  const reader = new FileReader();
  reader.addEventListener('load', event => {
      ttb = event.target.result;
      const timetableArray = ttb.split(/\u0000/g);
      timetableArray.pop();
      startTime = timetableArray.shift();
      timetable = new Timetable(startTime);
      currentTime = new Time(startTime);

      parseTimetable(timetableArray, timetable);
      ttbLoaded = true;
      $("#file-selector-ttb").prop("disabled", true);
      $("#station").prop("disabled", false);
      $("#start").prop("disabled", false);
      stations = timetable.getStationNameList();
      writeStations();
      currentStation = stations[0];
      writeToBoards(timetable, currentTime)
  });
  reader.readAsText(ttbFile);
}

function writeToBoards(timetable, currentTime) {
  writeSimpleBoard(timetable, currentTime);
  writeLongBoard(timetable, currentTime);
  writeStopBoard(timetable, currentTime);
  writeNSEBoard(timetable, currentTime);
}

function writeSimpleBoard(timetable, currentTime) {
  var deps = timetable.getNextDepartures(currentStation, currentTime, 3);

  $("#next .dest").text("1 " + deps[0].destination);
  var diff = deps[0].time.minutes - currentTime.minutes;
  var text = getText(diff);
  $("#next .deptime").text(text);

  $("#following .dest").text("2 " + deps[1].destination);
  var diff = deps[1].time.minutes - currentTime.minutes;
  var text = getText(diff);
  $("#following .deptime").text(text);

  $("#later .dest").text("3 " + deps[2].destination);
  var diff = deps[2].time.minutes - currentTime.minutes;
  var text = getText(diff);
  $("#later .deptime").text(text);

  $(".time #main").text(currentTime.toString());
}

function writeLongBoard(timetable, currentTime) {
  var deps = timetable.getNextDepartures(currentStation, currentTime, 9);
  for(let i = 0; i < 9; i++) {
    $(".simple-board #" + i + " .dest").text((i+1) + " " + deps[i].destination);
    var diff = deps[i].time.minutes - currentTime.minutes;
    var text = getText(diff);
    $(".simple-board #" + i + " .deptime").text(text);
  }
}

function writeStopBoard(timetable, currentTime) {
  var deps = timetable.getNextDepartures(currentStation, currentTime, 5);
  for(let i = 0; i < 5; i++) {
    $("#" + i + ".stop-board .time").text(deps[i].time.toString())
    $("#" + i + ".stop-board .dest").text(deps[i].destination)
    for(let j = 0; j < deps[i].stops.length; j++) {
      $("#" + i + ".stop-board #" + j + ".stop").text(deps[i].stops[j].name).css("color","orange");
      $("#" + i + ".stop-board #" + j + ".stop-time").text(deps[i].stops[j].time.toString()).css("color","orange");
    }
    for(let j = deps[i].stops.length; j < 8; j++) {
      $("#" + i + ".stop-board #" + j + ".stop").text("a").css("color","black");
      $("#" + i + ".stop-board #" + j + ".stop-time").text("a").css("color","black");
    }
  }
}

function writeNSEBoard(timetable, currentTime) {
  var deps = timetable.getNextDepartures(currentStation, currentTime, 6);
  for(let i = 0; i < 6; i++) {
    $(".nse #" + i + ".departure .deptime").text(deps[i].time.toString().replace(":", ""));
    $(".nse #" + i + ".departure .dest").text(deps[i].destination);
  }
  $(".nse .time").text("~ Time Now " + currentTime.toString().replace(":", "") + " ~")
}

function writeStations() {
  for(let i = 0; i < stations.length; i++) {
    var option = $("<option></option>").text(stations[i]);
    $("#station").append(option);
  }
}

function getText(diff) {
  if(diff == 1) {
    return "Due";
  } else {
    return diff + " mins";
  }
}

$(document).ready(function(){
  $("#start").click(function(){
    startClock();
  });

  $("#station").change(function() {
    currentStation = $(this).val();
    writeToBoards(timetable, currentTime);
  });
});