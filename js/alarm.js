let interval;
let hours = 0;
let minutes = 0;

let pickerElem = document.getElementsByClassName("timepicker")[0];
let options = {
  duration: 500,
  twelveHour: false,
  onCloseEnd: set
};
let timeText = document.getElementById("timeText");
let subText = document.getElementById("subText");
let submit = document.getElementById("submit");
submit.addEventListener("click", executeSetAlarm);
let picker = M.Timepicker.init(pickerElem, options);
pickerElem.addEventListener("change", () => {
  timeText.innerText = pickerElem.value;
});

let audio = new Audio("song.mp3");

//local storage
if (localStorage.getItem("alarm")) {
  let alarm = localStorage.getItem("alarm");
  if (alarm > new Date().getTime()) {
    let date = new Date(Number(alarm));
    hours = date.getHours();
    minutes = date.getMinutes();
    setAlarm();
  }
}

function executeSetAlarm() {
  hours = timeText.innerText[0] + timeText.innerText[1];
  minutes = timeText.innerText[3] + timeText.innerText[4];
  setAlarm();
}
function set() {
  let hours = timeText.innerHTML[0] + timeText.innerHTML[1];
  let minutes = timeText.innerHTML[3] + timeText.innerHTML[4];
  let currDate = new Date();
  destinationDate = new Date();
  destinationDate.setHours(hours);
  destinationDate.setMinutes(minutes);
  destinationDate.setSeconds(0);
  if (destinationDate < currDate) {
    destinationDate.setTime(destinationDate.getTime() + 86400000); //Add 24 hours (1 day) to the date, when expired
  }
  let until = destinationDate - currDate;
  let hoursUntil = Math.floor(until / 3600000);
  until -= 3600000 * hoursUntil;
  //Minutes
  let minutesUntil = Math.floor(until / 60000);
  until -= 60000 * minutesUntil;

  subText.innerHTML = `Alarm w ciągu <b>${formatText(
    hoursUntil,
    true
  )}</b> i <b>${formatText(minutesUntil, false)}</b>`;
}
function setAlarm() {
  timeText.classList.add("rainbow");
  let currDate = new Date();
  destinationDate = new Date();
  destinationDate.setHours(hours);
  destinationDate.setMinutes(minutes);
  destinationDate.setSeconds(0);
  if (destinationDate < currDate) {
    destinationDate.setTime(destinationDate.getTime() + 86400000); //Add 24 hours (1 day) to the date, when expired
  }
  timeText.innerText = `${formatTime(hours)}:${formatTime(minutes)}`;
  hideElements();
  document.title = "ALARM WYŁĄCZONY";
  submit.removeEventListener("click", executeSetAlarm);
}

function turnOn() {
  subText.innerHTML = `ALARM WŁĄCZONY NA <b>${formatTime(hours)}:${formatTime(
    minutes
  )}</b>`;
  subText.style.color = "#1dc267";
  subText.removeEventListener("click", turnOn);
  interval = setInterval(alarm, 750);
  localStorage.setItem("alarm", destinationDate.getTime());
  subText.addEventListener("click", deleteAlarm);
}

function alarm() {
  let currDate = new Date();
  let until = destinationDate - currDate;

  //Hours
  let hoursLeft = Math.floor(until / 3600000);
  until -= 3600000 * hoursLeft;
  //Minutes
  let minutesLeft = Math.floor(until / 60000);
  until -= 60000 * minutesLeft;
  //Seconds
  let secondsLeft = Math.floor(until / 1000);

  let timeLeft =
    formatTime(hoursLeft) +
    ":" +
    formatTime(minutesLeft) +
    ":" +
    formatTime(secondsLeft);
  if (destinationDate - currDate < 0) {
    alarmStop();
  } else {
    timeText.innerText = timeLeft;
    document.title = timeLeft;
  }
}

function alarmStop() {
  clearInterval(interval);

  timeText.style.fontSize = "15vmin";

  subText.innerHTML = "<b>CZAS MINĄŁ</b>";
  subText.style.fontSize = "15vmin";
  subText.style.color = "#f0422b";
  subText.removeEventListener("click", deleteAlarm);

  submit.style.opacity = 1;
  submit.classList.remove("submit");
  submit.classList.add("stopAlarm");
  submit.innerText = "Wyłącz";
  submit.addEventListener("click", destoryAlarm);

  document.title = "CZAS MINĄŁ";

  audio.play();
}
function destoryAlarm() {
  audio.pause();
  localStorage.removeItem("alarm");
  location.reload();
}
function formatText(value, isHour) {
  if (isHour) {
    return value === 1 ? `1 godziny` : `${value} godzin`;
  } else {
    return value === 1 ? `1 minuty` : `${value} minut`;
  }
}
function formatTime(value) {
  return value < 10 ? `0${parseInt(value)}` : `${parseInt(value)}`;
}
function hideElements() {
  submit.style.opacity = 0;
  timeText.style.fontSize = "40vmin";
  timeText.addEventListener("click", () => picker.destroy());
  subText.innerHTML = `<b>ALARM WYŁĄCZONY</b>`;
  subText.style.color = "#db6c2c";
  subText.addEventListener("click", turnOn);
}

function deleteAlarm() {
  subText.style.color = "rgb(236, 109, 109)";
  subText.innerHTML = "Alarm został wyłączony...";
  localStorage.removeItem("alarm");
  document.title = "Wyłączono alarm...";
  setTimeout(() => {
    location.reload();
  }, 2500);
}
