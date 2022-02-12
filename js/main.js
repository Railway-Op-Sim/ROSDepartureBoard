var timetable;
var currentTime;
var ttbLoaded = false;
var seconds = 0;

function startClock() {
  function secondClock(){
    if(seconds == 59) {
      seconds = 0;
      currentTime.increment();
      writeToBoard(timetable, "East Croydon", currentTime);
    } else {
      seconds++;
    }
    let secondString = seconds.toLocaleString('en-US', {
      minimumIntegerDigits: 2
    });
    $(".time #seconds").text(":" + secondString);
    setTimeout(secondClock, 25);
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
      writeToBoard(timetable, "East Croydon", currentTime)
  });
  reader.readAsText(ttbFile);
}

function writeToBoard(timetable, station, currentTime) {
  var deps = timetable.getNextDepartures(station, currentTime);

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
});