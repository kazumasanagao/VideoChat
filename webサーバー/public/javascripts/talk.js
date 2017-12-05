var talk_minute = 20;

var oniceFlag = false;
var talkingFlag = false;
var localVideo, remoteVideo;
var localStream = null;
var track;
var peerConnection = null;
var peerStarted = false;
var mediaConstraints = {mandatory: {OfferToReceiveAudio: true,OfferToReceiveVideo: true}};
var socket;
var socketReady = false;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

// socket: accept connection request
s.on('message', onMessage)
 .on('ready', onReady)
 .on('closevideo', onCloseVideo);

function onMessage(evt) {
    if (evt.type === 'offer') {
        //console.log("Received offer, set offer, sending answer....")
        onOffer(evt);   
    } else if (evt.type === 'answer' && peerStarted) {
        //console.log('Received answer, settinng answer SDP');
        onAnswer(evt);
    } else if (evt.type === 'candidate' && peerStarted) {
        //console.log('Received ICE candidate...');
        onCandidate(evt);
    } else if (evt.type === 'user disconnected' && peerStarted) {
        //console.log("disconnected");
        hangUp();
    }
}

function onReady(evt) {
    socketReady = true;
    localVideo = document.getElementById('local-video');
    remoteVideo = document.getElementById('remote-video');
    startVideo();
    //console.log('socket opened.');
}

function onCloseVideo(evt) {
    hangUp();
}
  
function onOffer(evt) {
    //console.log("Received offer...")
    //console.log(evt);
    setOffer(evt);
    sendAnswer(evt);
    peerStarted = true;
}
  
function onAnswer(evt) {
    //console.log("Received Answer...");
    //console.log(evt);
    setAnswer(evt);
}
  
function onCandidate(evt) {
    var candidate = new IceCandidate({sdpMLineIndex:evt.sdpMLineIndex, sdpMid:evt.sdpMid, candidate:evt.candidate});
    //console.log("Received Candidate...")
    //console.log(candidate);
    peerConnection.addIceCandidate(candidate);

    // oncandidateが何回きても、最初の一回だけ実行するためにフラグを用意
    if (!oniceFlag) {
        oniceFlag = true;
        isTimer = true;
        setStart();
        disp();
        $("#loading").fadeOut("fast");
        $("#talk_maincontainer").fadeIn("slow");
        window.onbeforeunload = function(){
            return 'If you reload, this call will be ended.';
        };
        // display:none だと効かないので、このタイミングで実行。
        if ($(".message_container").last().offset()) {
            last_top = $(".message_container").last().offset().top;
        }
        $('#chatbox').animate({scrollTop: last_top},0);
    }
}

function sendSDP(sdp) {
    var text = JSON.stringify(sdp);
    //console.log("---sending sdp text ---");
    //console.log(text);
    s.json.send(sdp);
}
  
function sendCandidate(candidate) {
    var text = JSON.stringify(candidate);
    //console.log("---sending candidate text ---");
    //console.log(text);
    s.json.send(candidate);
}
  
// ---------------------- video handling -----------------------
/*
if(!navigator.getUserMedia){
    alert("Your browser is not supported.\nSorry for uncovenience.\n<For Android user>\nChrome, Opera and Firefox are available.\n<For PC user>\nChrome, Opera and Firefox are available.\n<For iPhone user>\nI'm sorry. This app is not yet available. We are working on making iOS version.");
}
*/

// start local video
function startVideo() {
    var videoObj = {video: {
        mandatory : {
            minWidth: 320,
            minHeight: 240,
            maxWidth   : 320,
            maxHeight  : 240   
        }
    }, audio: true};
    if(!navigator.getUserMedia){
        alert("Your browser is not supported.\nSorry for uncovenience.\n<For Android user>\nChrome, Opera and Firefox are available.\n<For PC user>\nChrome, Opera and Firefox are available.\n<For iPhone user>\nI'm sorry. This app is not yet available. We are working on making iOS version.");
    } else {
        getUserMedia( videoObj, function (stream) {
            localStream = stream;
            track = stream.getTracks();
            //localVideo.src = Url.createObjectURL(stream);
            attachMediaStream(localVideo, stream);
            localVideo.play();
            localVideo.volume = 0;
            
            talkingFlag = true;
            setTimeout(function() { // localstreamの準備ができてからconnectする
                connect();
            }, 500); 
        },
        function (error) {
            //console.error('An error occurred: [CODE ' + error.code + ']');
            return;
        });
    }
}

  // ---------------------- connection handling -----------------------
function prepareNewConnection() {
    var pc_config = {"iceServers":[
        {"url": stun_url}
    ]};
    var options = {optional: [{DtlsSrtpKeyAgreement: true},{RtpDataChannels: true}]}
    var peer = null;
    try {
        if (stun_url) { // 本番
            peer = new RTCPeerConnection(pc_config, options);
        } else { // テスト
            peer = new RTCPeerConnection();
        }
    } catch (e) {
        //console.log("Failed to create peerConnection, exception: " + e.message);
    }
    // send any ice candidates to the other peer
    peer.onicecandidate = function (evt) {
        if (evt.candidate) {
            //console.log(evt.candidate);
            sendCandidate({type: "candidate", 
                sdpMLineIndex: evt.candidate.sdpMLineIndex,
                sdpMid: evt.candidate.sdpMid,
                candidate: evt.candidate.candidate
            });
        } else {
            //console.log("End of candidates. ------------------- phase=" + evt.eventPhase);
        }
    };
    //console.log('Adding local stream...');
    peer.addStream(localStream);
    peer.addEventListener("addstream", onRemoteStreamAdded, false);
    peer.addEventListener("removestream", onRemoteStreamRemoved, false)

    // when remote adds a stream, hand it on to the local video element
    function onRemoteStreamAdded(event) {
        //console.log("Added remote stream");
        //remoteVideo.src = Url.createObjectURL(event.stream);
        attachMediaStream(remoteVideo, event.stream);
    }
    // when remote removes a stream, remove it from the local video element
    function onRemoteStreamRemoved(event) {
        //console.log("Remove remote stream");
        remoteVideo.src = "";
    }
    return peer;
}

function sendOffer() {
    if (!peerConnection) {
        peerConnection = prepareNewConnection();
    }
    peerConnection.createOffer(function (sessionDescription) {
        peerConnection.setLocalDescription(sessionDescription);
        //console.log("Sending: SDP");
        //console.log(sessionDescription);
        sendSDP(sessionDescription);
    }, function () {
        //console.log("Create Offer failed");
    }, mediaConstraints);
}

function setOffer(evt) {
    if (peerConnection) {
        //console.log('peerConnection alreay exist!');
    }
    peerConnection = prepareNewConnection();
    peerConnection.setRemoteDescription(new SessionDescription(evt));
}
  
function sendAnswer(evt) {
    //console.log('sending Answer. Creating remote session description...' );
    if (! peerConnection) {
        //console.error('peerConnection NOT exist!');
        return;
    }
  
    peerConnection.createAnswer(function (sessionDescription) {
        peerConnection.setLocalDescription(sessionDescription);
        //console.log("Sending: SDP");
        //console.log(sessionDescription);
        sendSDP(sessionDescription);
    }, function (error) {
        //console.log("Create Answer failed");
        alert(error);
    }, mediaConstraints);
}

function setAnswer(evt) {
    if (!peerConnection) {
        //console.error('peerConnection NOT exist!');
        return;
    }
    peerConnection.setRemoteDescription(new SessionDescription(evt));
}
  
function connect() {
    if (!peerStarted && localStream && socketReady) {
        sendOffer();
        peerStarted = true;
    } else { // 片側はonofferのときにpeerstartedがtrueになっているから、双方がsendofferすることはない。
        //console.log(peerStarted + " " + localStream + " " + socketReady);
        //alert("Local stream not running yet - try again.");
    }
}

function hangUp() {
    //console.log("Hang up.");
    if (talkingFlag) {
        peerConnection.close();
        peerConnection = null;
        localVideo.src = "";
        remoteVideo.src = "";
        for (var i = 0; i < track.length; i++) {
            track[i].stop();
        }

        window.onbeforeunload = null;
        localVideo = null;
        remoteVideo = null;
        localStream = null;
        socketReady = false;
        peerStarted = false; 
        talkingFlag = false;
        oniceFlag = false;
        isTimer = false;
        s.emit("closevideo");
    }
}

// タイマー関係
var start;
var min = 0, sec = 0, now = 0, datet = 0;
var isTimer = true;
function setStart() {
    start = new Date();
}
function disp(){
    if (isTimer) {
        now = new Date();
        datet = parseInt((now.getTime() - start.getTime()) / 1000);
        min = parseInt((datet / 60) % 60);
        sec = datet % 60;
        if(min < 10) { min = "0" + min; }
        if(sec < 10) { sec = "0" + sec; }
        
        if (min >= talk_minute - 1) {
            $("#timer").css("color", "red");
        }
        if (min >= talk_minute) {
            hangUp();
        }
        var timer = min + ':' + sec;
        $("#timer").html(timer);
        setTimeout("disp()", 1000);
    }
}