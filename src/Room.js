import React, { useEffect, useState } from "react";
import Participant from "./Participant";

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [audio,setAudio]=useState(true)
  const [video,setVideo]=useState(true)

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  const switchVideo = () => {
    if(video==false){
      room.localParticipant.videoTracks.forEach(track => {
        console.log(track);
        track.track.enable();
      });
      setVideo(true)
    }else{
      room.localParticipant.videoTracks.forEach(track => {
        console.log(track);
        track.track.disable();
      });
      setVideo(false)
    }
    
  }

  const switchAudio = () => {
    if(audio==false){
      room.localParticipant.audioTracks.forEach(track => {
        track.track.enable();
      });
      setAudio(true)
    }else{
      room.localParticipant.audioTracks.forEach(track => {
        track.track.disable();
      });
      setAudio(false)
    }
  }

  return (
    <div className="room">
    
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
            handleAudio={switchAudio}
            handleVideo={switchVideo}
            handleLogout={handleLogout}
          />
        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
