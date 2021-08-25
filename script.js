let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement("audio");

// Define the tracks that have to be played
let track_list = [
    {
        name: "Lost in Sound",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.scdn.co%2Fimage%2F8981ea334e8c9c524fac295ba8b737c851812d00&f=1&nofb=1",
        path: "https://cdn.discordapp.com/attachments/750607286111567933/870186233886806066/Lost_In_Sound.mp3",
    },
    {
        name: "Together",
        author: "Marshmello",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130204519694336/Marshmello_-_Together_Official_Music_VideoMP3_160K.mp3"
    },
    {
        name: "Come & Get It",
        author: "Selena Gomez",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130215966605332/Selena_Gomez_-_Come___Get_ItMP3_128K.mp3"
    },
    {
        name: "Boy With Luv",
        author: "BTS",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130258811289620/BTS____Boy_With_Luv_feat._HalMP3_160K.mp3"
    },
    {
        name: "Rockabye",
        author: "Clean Bandit",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130262342893618/Clean_Bandit_-_Rockabye_feat._Sean_Paul___Anne-MaMP3_160K.mp3"
    },
    {
        name: "Blank Space",
        author: "Taylor Swift",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130294697885696/Taylor_Swift_-_Blank_SpaceMP3_160K.mp3"
    },
    {
        name: "What Do You Mean",
        author: "Justin Bieber",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130340311203840/Justin_Bieber_-_What_Do_You_Mean__Official_MusicMP3_160K.mp3"
    },
    {
        name: "As Long As You Love Me",
        author: "Justin Bieber",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130390810230824/Justin_Bieber_-_As_Long_As_You_Love_Me_ft._Big_SeaMP3_160K.mp3"
    },
    {
        name: "Confident",
        author: "Justin Bieber ft. Chance The Rapper - YouTube",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130398385143818/Justin_Bieber_-_Confident_ft._Chance_The_Rapper_OMP3_160K.mp3"
    },
    {
        name: "Intentions",
        author: "Justin Bieber ft. Quavo",
        path: "https://cdn.discordapp.com/attachments/775740994595323954/782130437514067998/Justin_Bieber_-_Intentions_ft._Quavo_Official_VidMP3_160K.mp3"
    },
];

console.log("powered by F-Fengzi")

function loadTrack(track_index) {
    clearInterval(updateTimer);
    resetValues();

    // Load a new track
    curr_track.src = track_list[track_index].path;
    curr_track.load();

    // Update details of the track
    track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
    track_name.textContent = track_list[track_index].name;

    // Set an interval of 1000 milliseconds for updating the seek slider
    updateTimer = setInterval(seekUpdate, 1000);

    // Move to the next track if the current one finishes playing
    curr_track.addEventListener("ended", nextTrack);
    fetch(
        `https://my-api.reynoob.repl.co/lyrics?query=${track_list[track_index].name
            .trim()
            .split(/ +/g)
            .join("%20")}`
    )
        .then((res) => res.json())
        .then((res) => {
            let lyricsDiv = document.getElementById("lyrics-para");
            if (res.error) {
                return (lyricsDiv.innerText = "No Lyrics Found. Please try closing this and opening the lyrics tab again :)");
            } else {
                return (lyricsDiv.innerText = res.message);
            }
        });
}

//shuffle GAY IF YOU TOUCH THIS UR PP = SMOL 
function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  

// Reset Values
function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseTrack() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    track_art.classList.add("rotate");
    // Replace icon with the pause icon
    document.getElementById("play").innerHTML = '<i class="fa fa-pause"></i>';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove("rotate");
    // Replace icon with the play icon
    document.getElementById("play").innerHTML = '<i class="fa fa-play"></i>';
}

function nextTrack() {
    shuffle(track_list);
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    shuffle(track_list);
    loadTrack(track_index);
    playTrack();
}

function seekTo() {
    seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}

function h() {
    curr_track.volume = 0.4
}

function seekUpdate() {
    let seekPosition = 0;

    // Check if the current track duration is a legible number
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        // Calculate the time left and the total duration
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        // Adding a zero to the single digit time values
        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }
        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }
        if (currentMinutes < 10) {
            currentMinutes = "0" + currentMinutes;
        }
        if (durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
        }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

// Load the first track in the tracklist
loadTrack(track_index);

// gayansh

function manageLyricsClick() {
    let lyricsDiv = document.getElementById("lyrics-div");
    if (lyricsDiv.classList.contains("no-display")) {
        lyricsDiv.style.height = "100%";
        lyricsDiv.classList.remove("no-display");
        fetch(
            `https://my-api.reynoob.repl.co/lyrics?query=${track_list[track_index].name
                .trim()
                .split(/ +/g)
                .join("%20")}`
        )
            .then((res) => res.json())
            .then((res) => {
                let lyricsDiv = document.getElementById("lyrics-para");
                if (res.error) {
                    return (lyricsDiv.innerText = "No Lyrics Found. Please Close the lyrics tab and open it again :)");
                } else {
                    return (lyricsDiv.innerText = res.message);
                }
            });
    } else {
        lyricsDiv.style.height = "0%";
        lyricsDiv.classList.add("no-display");
    }
}

// document.onsubmit = function (e) {
//     e.preventDefault();
// };

function shad() {
    document.getElementById("show").style.display == "block" && document.getElementById("choose").style.display == "block"
        document.getElementById("show").style.display = "none";
        document.getElementById("choose").style.display = "none";
        document.getElementById("wrap").style.display = "none";
}

function user() {
        document.getElementById("show").style.display = "block";
        document.getElementById("choose").style.display = "block";
}
function serch() {
    document.getElementById("show").style.display = "block";
    document.getElementById("wrap").style.display = "block";
}


document.onkeydown = function(event){
    if (event.keyCode == 27){
        if (document.getElementById("show").style.display == "block" && document.getElementById("choose").style.display == "block"){
            document.getElementById("show").style.display = "none";
            document.getElementById("choose").style.display = "none";
            document.getElementById("wrap").style.display = "none";
        }
    }
}
