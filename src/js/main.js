document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");
  const albumnArt = document.getElementById("albumn-art");
  const progressFilled = document.getElementById("progress-filled");
  const track = document.querySelector(".bg-gray-600");
  const progressThumb = document.getElementById("progress-thumb");
  const gradientBg = document.getElementById("gradient-bg");
  const bodyGradient = document.getElementById("body-gradient");

  const playSVG = `<svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                    d="M4.79062 2.09314C4.63821 1.98427 4.43774 1.96972 4.27121 2.05542C4.10467 2.14112 4 2.31271 4 2.5V12.5C4 12.6873 4.10467 12.8589 4.27121 12.9446C4.43774 13.0303 4.63821 13.0157 4.79062 12.9069L11.7906 7.90687C11.922 7.81301 12 7.66148 12 7.5C12 7.33853 11.922 7.18699 11.7906 7.09314L4.79062 2.09314Z"
                    fill="#fff"
                    />
                    </svg>
                   `;

  const pauseSVG = `<svg
                    fill="#fff"
                    width="20px"
                    height="20px"
                    viewBox="-64 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <title>pause</title>
                    <path
                        d="M64 96L160 96 160 416 64 416 64 96ZM224 96L320 96 320 416 224 416 224 96Z"
                    />
                    </svg>
                   `;

  const songs = [
    {
      title: "Residential",
      artist: "Jammabands",
      src: "./audio/residential.mp3",
      cover: "./images/residential.jpg",
    },
    {
      title: "wassup",
      artist: "Channelfather",
      src: "./audio/wassup.mp3",
      cover: "./images/wassup.jpg",
    },
    {
      title: "cant get enough",
      artist: "Skyte",
      src: "./audio/cantgetenough.mp3",
      cover: "./images/cgeskyte.jpg",
    },
  ];

  let currentSong = 0;

  function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumnArt.src = song.cover;
  }

  function togglePlay() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  playBtn.addEventListener("click", togglePlay);

  function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    audio.play();
  }

  function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    audio.play();
  }

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    progressFilled.style.width = percent + "%";

    const trackWidth = track.offsetWidth;
    progressThumb.style.left = `calc(${percent}% - ${
      progressThumb.offsetWidth / 2
    }px)`;
  });

  track.addEventListener("click", (e) => {
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    audio.currentTime = newTime;
  });

  nextBtn.addEventListener("click", nextSong);

  prevBtn.addEventListener("click", prevSong);

  audio.addEventListener("ended", nextSong);

  audio.addEventListener("play", () => {
    playBtn.innerHTML = pauseSVG;
    isPlaying = true;
  });

  audio.addEventListener("pause", () => {
    playBtn.innerHTML = playSVG;
    isPlaying = false;
  });

  function updateGradient() {
    // Triggered whenever album art changes
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = albumnArt.naturalWidth;
    canvas.height = albumnArt.naturalHeight;

    ctx.drawImage(albumnArt, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    for (let i = 0; i < data.length; i += 40) {
      // sample pixels for speed
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    gradientBg.style.background = `linear-gradient(135deg, rgb(${r},${g},${b}), #000000)`;
    gradientBg.style.transition = "background 1s ease";
    bodyGradient.style.background = `linear-gradient(135deg, rgb(${r},${g},${b}), #000000)`;
    bodyGradient.style.transition = "background 1s ease";
  }

  if (albumnArt.complete) {
    updateGradient();
  } else {
    albumnArt.addEventListener("load", updateGradient);
  }

  loadSong(currentSong);
});
