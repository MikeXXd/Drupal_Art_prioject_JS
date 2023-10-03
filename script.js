import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js";

// preset-----------------------------------start--
                            
const  MIN_PX_PER_SEC = 5; // ideal MIN_PX_PER_SEC for screen width: 1920px is 5

// preset-----------------------------------end--

const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const actualTime = document.getElementById("currentTime");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const muteBtn = document.getElementById("muteBtn");
const playing = document.getElementById("music");


const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#A8DBA8",
  progressColor: "#3B8686",
  url: "./media/track.mp3",
  minPxPerSec: MIN_PX_PER_SEC,
  cursorColor: "chartreuse",
  cursorWidth: 2,
  dragToSeek: true,
});

// console.log(wavesurfer.options);

playBtn.onclick = () => {
  wavesurfer.playPause();
  if (playBtn.src.includes("play.png")) {
    playBtn.src = "./media/pause.png";
    playing.classList.add("playing");
  } else {
    playBtn.src = "./media/play.png";
    playing.classList.remove("playing")

  }
};



stopBtn.onclick = () => {
  wavesurfer.stop();
  playing.classList.remove("playing");
  playBtn.src = "./media/play.png";
};

muteBtn.onclick = () => {
  wavesurfer.getMuted()
    ? (wavesurfer.setMuted(false), (muteBtn.src = "./media/volume.png"))
    : (wavesurfer.setMuted(true), (muteBtn.src = "./media/mute.png"));
};

zoomInBtn.onclick = () => {
  let value = wavesurfer.options.minPxPerSec;
  if (value >= MIN_PX_PER_SEC * 2 ** 5) {
    return;
  }
  value *= 2;
  wavesurfer.zoom(value);
  console.log("current minPxPerSec", value);
};

zoomOutBtn.onclick = () => {
  let value = wavesurfer.options.minPxPerSec;
  if (value > MIN_PX_PER_SEC) {
    value /= 2;
  } else {
    return;
  }
  wavesurfer.zoom(value);
  console.log("current minPxPerSec", value);
};

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor(
    (timeInSeconds - Math.floor(timeInSeconds)) * 100
  );
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}.${milliseconds < 10 ? "0" : ""}${milliseconds}`;
}

wavesurfer.on(
  "timeupdate",
  (currentTime) => (actualTime.textContent = formatTime(currentTime))
);

wavesurfer.on("finish", () => {
  playBtn.src = "./media/play.png";
  wavesurfer.stop();
});







// NOT IN USE / JUST CONSOLE INFO.----------------------------------------start
async function init() {
  let div = document.getElementById("waveform");
  let pixels = 0;
  await wavesurfer.on("decode", (duration) => {
    pixels = Math.floor(div.scrollWidth / duration) - 1;
    console.log(
      "ideal pixels per sec at start:",
      pixels,
      "current MIN_PX_PER_SEC:",
      MIN_PX_PER_SEC
    );
  });
}

init();
// NOT IN USE / JUST CONSOLE INFO.----------------------------------------end
