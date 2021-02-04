const PORT = 3000;
const socket = io();
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
const myVideo = document.createElement("video");
myVideo.muted = true;
var peer = new Peer(undefined, {
    path: '/peerjs',
    host : '/',
    port : `${PORT}`
});
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo,stream);
    
    peer.on('call',call => {
        call.answer (stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video,userVideoStream);
        });
    });

    socket.on('user-connected',(userId) => {
        connectToNewUser(userId,stream);
    });
    

    let text = $('input')

    $('html').keydown(e => {
        if (e.which == 13 && text.val().length !== 0) {
            
            socket.emit("MSG", text.val());
            text.val('');
        }
    });

    socket.on("CRTMSG",message => {
        console.log("from server = ",message);
        $('.messages').append(`<li class = "message"><b>user</b><br/>${message}</li>`);
        scrollToBottom();
    }); 
    
});
peer.on("open",id => {
    socket.emit("join-room",ROOM_ID, id);    
});



const connectToNewUser = (userId,stream) => {
    console.log("new user connected by varun = "+userId);
    const call = peer.call(userId,stream);
    const video = document.createElement('video');
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
}
const addVideoStream = (video,stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play();
    });
    videoGrid.append(video);
};

const scrollToBottom = () => {
    var d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
};


// impt for button
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmute();
    }
    else{
        setMute();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};
const setMute = () => {
    const html = `<img id="rupali" src="mute.png" width="40px"height="40px"><span>Mute</span>`;
    document.querySelector('.MUTE_BTN').innerHTML = html;
};
const setUnmute = () => {
    const html = `<img id="rupali" src="mute.png" width="40px"height="40px"><span>Unmute</span>`;
    document.querySelector('.MUTE_BTN').innerHTML = html;
};

const playstop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlay();
    }
    else {
        setStop();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const setPlay = () => {
    const html = `<img id = "rupali" src="stop.svg" width="40px" height="40px">
    <span>Allow Video</span>`;
    document.querySelector('.VID_STOP').innerHTML = html;
}

const setStop = () => {
    const html = `<img id = "rupali" src="stop.svg" width="40px" height="40px">
    <span>Disable Video</span>`;
    document.querySelector('.VID_STOP').innerHTML = html;
}