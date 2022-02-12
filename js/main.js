var timetable;
var currentTime;

$(document).ready(function() {
  function clock(){
    setTimeout(clock, 1000);
  }
  setTimeout(clock, 10);
});

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
  });
  reader.readAsText(ttbFile);
}
