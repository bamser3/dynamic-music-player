document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");
  const albumnArt = document.getElementById("albumn-art");
  const progressFilled = document.getElementById("progress-filled");
  const track =
    document.getElementById("track") || document.querySelector(".bg-gray-600");
  const progressThumb = document.getElementById("progress-thumb");
  const gradientBg = document.getElementById("gradient-bg");
  const gradientBgA = document.getElementById("gradient-bg-a");
  const gradientBgB = document.getElementById("gradient-bg-b");
  const bodyGradient = document.getElementById("body-gradient");

  // track which gradient layer is visible
  let activeGradient = gradientBgA || gradientBgB;
  let inactiveGradient =
    gradientBgA === activeGradient ? gradientBgB : gradientBgA;

  // helper to apply a gradient string to a DOM node and ensure opacity transitions are set
  function applyGradientToLayer(layer, cssGradient) {
    if (!layer) return;
    layer.style.background = cssGradient;
    layer.style.transition = "opacity 900ms ease, background 900ms ease";
    // ensure will-change for smoother transitions
    layer.style.willChange = "opacity";
  }

  let isPlaying = false;

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
      title: "i wish i did better",
      artist: "softsuicide",
      src: "./audio/iwidb.mp3",
      cover: "./images/iwidbCover.jpg",
    },
    {
      title: "Tactical Retreat",
      artist: "Nurture Nurture",
      src: "./audio/tacticalRetreat.mp3",
      cover: "./images/tacticalRetreatCover.jpg",
    },
    {
      title: "Time Within",
      artist: "Tyler Gill",
      src: "./audio/timeWithin.mp3",
      cover: "./images/timeWithinCover.jpg",
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

    // guard: ensure progressThumb exists and track has width
    if (progressThumb && track) {
      progressThumb.style.left = `calc(${percent}% - ${
        progressThumb.offsetWidth / 2
      }px)`;
    }
  });

  if (track) {
    track.addEventListener("click", (e) => {
      const rect = track.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * audio.duration;
      audio.currentTime = newTime;
    });
  }

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
    // ensure image has dimensions
    const imgW = albumnArt.naturalWidth || albumnArt.width;
    const imgH = albumnArt.naturalHeight || albumnArt.height;
    if (!imgW || !imgH) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imgW;
    canvas.height = imgH;

    try {
      ctx.drawImage(albumnArt, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      // drawImage can throw if image is cross-origin; bail out gracefully
      return;
    }

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    const step = Math.max(4, Math.floor(data.length / 4 / 200) * 4); // limit to ~200 samples
    for (let i = 0; i < data.length; i += step) {
      if (i + 2 >= data.length) break;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    if (count === 0) return;

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    const cssGradient = `linear-gradient(135deg, rgb(${r}, ${g}, ${b}), #000000)`;

    // Cross-fade: set new gradient on the inactive layer, fade it in, fade out the active
    if (inactiveGradient && activeGradient) {
      applyGradientToLayer(inactiveGradient, cssGradient);

      // force a reflow so the opacity transition reliably triggers
      // eslint-disable-next-line no-unused-expressions
      inactiveGradient.offsetHeight;

      inactiveGradient.style.opacity = "1";
      activeGradient.style.opacity = "0";

      // after transition, swap active/inactive
      setTimeout(() => {
        const tmp = activeGradient;
        activeGradient = inactiveGradient;
        inactiveGradient = tmp;
      }, 950);
    } else {
      // fallback: set single layer / body gradient
      if (gradientBgA) applyGradientToLayer(gradientBgA, cssGradient);
      if (gradientBgB) applyGradientToLayer(gradientBgB, cssGradient);
    }

    // update body gradient immediately (optional crossfade can be implemented similarly)
    if (bodyGradient) {
      bodyGradient.style.background = cssGradient;
      bodyGradient.style.transition = "background 900ms ease";
    }
  }

  // ensure both layers are initialized so the first update shows immediately
  if (gradientBgA) {
    gradientBgA.style.transition = "opacity 900ms ease";
    gradientBgA.style.opacity = "1";
  }
  if (gradientBgB) {
    gradientBgB.style.transition = "opacity 900ms ease";
    gradientBgB.style.opacity = "0";
  }

  // always attach load listener so subsequent src changes trigger the gradient update
  if (albumnArt) {
    albumnArt.addEventListener("load", updateGradient);
    if (albumnArt.complete) {
      // update immediately if already loaded
      updateGradient();
    }
  }

  loadSong(currentSong);
});
