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
});
peer.on("open",id => {
    socket.emit("join-room",ROOM_ID, id);    
});


socket.on('user-connected',(userId,) => {
    connectToNewUser(userId,stream);
    
});
const connectToNewUser = (userId) => {
    console.log("new user connected by varun = "+userId);
    const call = myPeer.call(userId,stream);
    const video = document.createElement('video');
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
}
const addVideoStream = (video,stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () =>{
        video.play();
    })
    videoGrid.append(video);
}