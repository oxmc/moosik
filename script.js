let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let now_playing = document.querySelector(".now-playing");

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
        name: "Cipher Lemmino",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fb0q5PR1xpA0%2Fmaxresdefault.jpg&f=1&nofb=1",
        path: "https://cdn.discordapp.com/attachments/750607286111567933/870187068108722186/cipher-bgm.mp3",
    },
    {
        name: "Shipping Lanes",
        artist: "Chad Crouch",
        image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
        path: "https://cdn.discordapp.com/attachments/798132316412837910/870248798893531136/Masked_Wolf_-_Astronaut_In_The_Ocean_Official_Music_Video.mp3",
    },
    {
        name: "Shipping Lanes",
        artist: "Chad Crouch",
        image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
        path: "https://cdn.discordapp.com/attachments/798132316412837910/870248912026476564/never-gonna-give-you-up-video.mp3",
    },
    {
        name: "Shipping Lanes",
        artist: "Chad Crouch",
        image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
        path: "https://cdn.discordapp.com/attachments/798132316412837910/870249235973546054/muhtemel.mp3",
    },
];

function loadTrack(track_index) {
    clearInterval(updateTimer);
    resetValues();

    // Load a new track
    curr_track.src = track_list[track_index].path;
    curr_track.load();

    // Update details of the track
    track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
    track_name.textContent = track_list[track_index].name;
    now_playing.textContent =
        "PLAYING " + (track_index + 1) + " OF " + track_list.length + " TRACKS ";

    // Set an interval of 1000 milliseconds for updating the seek slider
    updateTimer = setInterval(seekUpdate, 100);

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
                return (lyricsDiv.innerText = "No Lyrics Found.");
            } else {
                return (lyricsDiv.innerText = res.message);
            }
        });
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
    if (track_index < track_list.length - 1) track_index += 1;
    else track_index = 0;
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    if (track_index > 0) track_index -= 1;
    else track_index = track_list.length;
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
                    return (lyricsDiv.innerText = "No Lyrics Found.");
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
