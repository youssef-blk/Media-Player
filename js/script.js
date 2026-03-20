let input = document.getElementById("file");
let playlist = document.getElementById("playlist");
let addBtn = document.getElementById("addBtn");

//? Musics Array , Where Every Music Stocked
let musics = [
  {
    id: 1,
    title: "Evergreen",
    artist: "Richy Mitch & The Coal Miners",
    src: "audio/Richy_Mitch_The_Coal_Miners_Evergreen_Lyrics_InvertOG.m4a",
    img: "imgs/evergreen.jpg",
  },
  {
    id: 2,
    title: "Idea 9",
    artist: "Gibran Alcocer",
    src: "audio/Idea 9 - Gibran Alcocer.m4a",
    img: "imgs/idea9.jpg",
  },
  {
    id: 3,
    title: "Wavin' Flag",
    artist: "K'NAAN",
    src: "audio/Wavin'  Flag (Coca-Cola® Celebration Mix).m4a",
    img: "imgs/waving.jpg",
  },
];

// Extract the info from the file (img, title) and add them to the musics array
function renderMusic(file) {
  jsmediatags.read(file, {
    onSuccess: function (tag) {
      let picture = tag.tags.picture;
      //* Getting The ALbum image
      if (picture) {
        let data = picture.data;
        let format = picture.format;

        let byteArray = new Uint8Array(data);

        let blob = new Blob([byteArray], { type: format });

        let url = URL.createObjectURL(blob);

        albumImage.src = url;
        songLogo.src = url;
        var pictureSrc = url;
        document.getElementById("background-blur").style.backgroundImage =
          `url(${url})`;
      } else {
        albumImage.src = defaultImgSrc;
        songLogo.src = defaultImgSrc;
        var pictureSrc = defaultImgSrc;
        document.getElementById("background-blur").style.backgroundImage =
          `url(../${defaultImgSrc})`;
      }
      let title = tag.tags.title;
      let artist = tag.tags.artist;

      songName.textContent = title;
      songArtist.textContent = artist;

      //& ----------------------------------------------
      let cpt = 0;
      for (let i of musics) {
        if (i.title !== title) {
          cpt++;
        }
      }

      if (cpt === musics.length) {
        let music = {
          id: musics.length + 1,
          title: title,
          artist: artist,
          src: URL.createObjectURL(input.files[0]),
          img: pictureSrc,
          file: file,
        };
        audio.setAttribute("data-id", music.id - 1);
        musics.push(music);
      }

      //& ----------------------------------------------

      renderPlaylist();
    },
  });
}

function renderTrialMusic(ele) {
  albumImage.src = ele.img;
  songLogo.src = ele.img;
  document.getElementById("background-blur").style.backgroundImage =
    `url(${ele.img})`;
  songName.textContent = ele.title;
  audio.setAttribute("data-id", Number(ele.id) - 1);

  songArtist.textContent = ele.artist;
  audio.addEventListener("loadedmetadata", () => {
    duration.innerText = formatTime(audio.duration);
    range.max = Math.floor(audio.duration);
  });
}

// transfer the objexts in music list to an HTML elements in Playlist
function renderPlaylist() {
  playlist.innerHTML = "";
  for (let i of musics) {
    let span = document.createElement("span");
    let img = document.createElement("img");
    let div = document.createElement("div");
    let h4 = document.createElement("h4");
    let p = document.createElement("p");
    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("id", "deleteBtn");
    deleteBtn.innerHTML = "<i class='fa-solid fa-trash-can'></i>";

    h4.textContent = i.title;
    p.textContent = i.artist;
    img.src = i.img;
    span.setAttribute("id", i.id);

    span.setAttribute("class", "playlistElement");

    div.append(h4, p);
    span.append(img, div, deleteBtn);
    playlist.appendChild(span);
  }
}

renderPlaylist();

// Transfer seconds to a real time
function formatTime(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  if (sec < 10) {
    sec = "0" + sec;
  }
  return `${min}:${sec}`;
}

// ? Transfer the button to an file input;
addBtn.addEventListener("click", () => {
  input.click();
});

let audio = document.querySelector("audio");

let previous = document.getElementById("previous");
let next = document.getElementById("next");

let backwards = document.getElementById("backwards");
let forwards = document.getElementById("forwards");

let pause = document.getElementById("pause");
let play = document.getElementById("play");

let defaultImgSrc = "imgs/default.jpg";

let albumImage = document.getElementById("album-img");
let duration = document.getElementById("duration");
let timeSpan = document.getElementById("time");
let range = document.querySelector("input[type='range']");

let songName = document.getElementById("song-name");
let songArtist = document.getElementById("artist");
let songLogo = document.getElementById("songLogo");

let repeat = document.getElementById("repeat");
let shuffle = document.getElementById("shuffle");

// Play Function
play.addEventListener("click", () => {
  audio.play();
  play.classList.add("hide");
  pause.classList.remove("hide");
  songLogo.classList.add("rotate");
});

// Pause Function
pause.addEventListener("click", () => {
  audio.pause();
  pause.classList.add("hide");
  play.classList.remove("hide");
  songLogo.classList.remove("rotate");
});

// Go 10s Forwars and Backwards
forwards.addEventListener("click", () => {
  audio.currentTime += 10;
});
backwards.addEventListener("click", () => {
  audio.currentTime -= 10;
});

// Choose From the Playlist Function
playlist.addEventListener("click", function (e) {
  pause.classList.add("hide");
  play.classList.remove("hide");
  songLogo.classList.remove("rotate");

  let item = e.target.closest(".playlistElement");
  if (e.target.closest("button")) deleteItem(item);
  if (!item) return;

  let songId = item.getAttribute("id");

  musics.forEach((ele) => {
    if (ele.id == songId) {
      audio.src = ele.src;
      if (ele.file) {
        renderMusic(ele.file);
        audio.setAttribute("data-id", ele.id - 1);
      } else {
        //* This is an Exception for trial musics because I can't extract the file info from them
        renderTrialMusic(ele);
      }
    }
  });
});

// Add From the input Function
//! Transform the file as src for the audio
input.onchange = function () {
  audio.src = URL.createObjectURL(input.files[0]);

  pause.classList.add("hide");
  play.classList.remove("hide");

  renderMusic(input.files[0]);

  songLogo.classList.remove("rotate");

  audio.addEventListener("loadedmetadata", () => {
    duration.innerText = formatTime(audio.duration);
    range.max = Math.floor(audio.duration);
  });
};

// Update The Informations Function
audio.addEventListener("timeupdate", () => {
  timeSpan.innerText = formatTime(audio.currentTime);
  range.value = audio.currentTime;

  //& Repeat And Shuffle Btns functinalty (I'm So Proud Because It's worked from the first try)

  if (audio.currentTime === audio.duration) {
    if (repeat.classList.contains("active")) {
      audio.currentTime = 0;
      audio.play();
    } else if (shuffle.classList.contains("active")) {
      let currentIndex = Number(audio.getAttribute("data-id"));

      do {
        var nextIndice = Math.floor(Math.random() * playlist.children.length);
      } while (currentIndex == nextIndice);
      playlist.children[nextIndice].click();
      audio.play();
      play.classList.add("hide");
      pause.classList.remove("hide");
      songLogo.classList.add("rotate");
    } else {
      let currentIndex = Number(audio.getAttribute("data-id"));

      if (currentIndex + 1 >= playlist.children.length) {
        playlist.children[0].click();
      } else {
        playlist.children[currentIndex + 1].click();
      }
      audio.play();
      play.classList.add("hide");
      pause.classList.remove("hide");
      songLogo.classList.add("rotate");
    }
  }

  let value = (range.value / range.max) * 100;
  range.style.background = `linear-gradient(
    to right,
    #1DB954 0%,
    #1DB954 ${value}%,
    #444 ${value}%,
    #444 100%
  )`;
  range.addEventListener("input", () => {
    audio.currentTime = range.value;
  });
});

//* Customize timeline input
range.addEventListener("input", () => {
  let value = (range.value / range.max) * 100;

  range.style.background = `linear-gradient(
    to right,
    #1DB954 0%,
    #1DB954 ${value}%,
    #444 ${value}%,
    #444 100%
  )`;
});

// Previos Song button Function
previous.addEventListener("click", () => {
  let currentId = Number(audio.getAttribute("data-id")) - 1;

  if (currentId < 0) {
    currentId = musics.length - 1;
  }

  let currentElement = musics[currentId];

  audio.src = currentElement.src;

  audio.play();

  if (currentElement.file) {
    renderMusic(currentElement.file);
  } else {
    //* This is an Exception for trial musics because I can't extract the file info from them
    renderTrialMusic(currentElement);
  }
  audio.setAttribute("data-id", currentId);
});

// Next Song button Function
next.addEventListener("click", () => {
  let currentId = Number(audio.getAttribute("data-id")) + 1;
  console.log(currentId);
  if (currentId >= musics.length) {
    console.log(currentId);
    currentId = 0;
  }
  console.log(currentId);
  let currentElement = musics[currentId];

  audio.src = currentElement.src;

  audio.play();

  if (currentElement.file) {
    renderMusic(currentElement.file);
  } else {
    //* This is an Exception for trial musics because I can't extract the file info from them
    renderTrialMusic(currentElement);
  }
  audio.setAttribute("data-id", currentId);
});

let volumeUp = document.getElementById("volume-up");
let volumeDown = document.getElementById("volume-down");

// Volume Buttons
volumeUp.addEventListener("click", () => {
  try {
    audio.volume += 0.1;
  } catch {
    return;
  }
});
volumeDown.addEventListener("click", () => {
  try {
    audio.volume -= 0.1;
  } catch {
    return;
  }
});

// Delete Music from Playlist Function
let deleteBtn = document.getElementById("deleteBtn");
function deleteItem(item) {
  let currentId = Number(item.id);

  let index = currentId - 1;

  musics.splice(index, 1);

  item.remove();

  let elements = document.querySelectorAll(".playlistElement");

  elements.forEach((el, i) => {
    el.id = i + 1;
    musics[i].id = i + 1;
  });

  if (musics.length > 0) {
    let nextIndex = index >= musics.length ? musics.length - 1 : index;

    let song = musics[nextIndex];

    if (song.file) {
      renderMusic(song.file);
    } else {
      renderTrialMusic(song);
    }
  } else {
    audio.src = "";
    albumImage.src = defaultImgSrc;
    songLogo.src = defaultImgSrc;
    songName.textContent = "";
    songArtist.textContent = "";
    document.getElementById("background-blur").style.backgroundImage =
      `url(../${defaultImgSrc})`;
    duration.textContent = "0:00";
  }
}

// clicking status in shuffle and repeat buttons
repeat.addEventListener("click", () => {
  if (
    shuffle.classList.contains("active") &&
    !repeat.classList.contains("active")
  ) {
    return;
  } else {
    repeat.classList.toggle("active");
  }
});
shuffle.addEventListener("click", () => {
  if (repeat.classList.contains("active")) {
    return;
  }
  shuffle.classList.toggle("active");
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if (audio.paused) {
      play.click();
    } else {
      pause.click();
    }
  }
});
