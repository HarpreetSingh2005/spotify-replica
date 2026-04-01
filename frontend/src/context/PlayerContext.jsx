import { createContext, useRef, useState, useEffect } from "react";

export const PlayerContext = createContext(); //A Gloabl Shared Container
// It only creates the mechanism for sharing.

export const PlayerProvider = ({ children }) => {
  //Everything inside this provider can access player data

  const audioRef = useRef(new Audio()); //A ref to the audio element(new Audio()), used to play files either on or offscreen

  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  //Play Song
  const playSong = (song, songQueue = []) => {
    if (!song) return;

    audioRef.current.src = song.musicUri;
    audioRef.current.play();

    setCurrentSong(song);
    setQueue(songQueue);
    setCurrentIndex(songQueue.findIndex((s) => s._id === song._id));

    setIsPlaying(true);
  };

  //Toggle Play
  const togglePlay = () => {
    if (!currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  //Next
  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    playSong(queue[nextIndex], queue);
  };

  //Prev
  const playPrev = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playSong(queue[prevIndex], queue);
  };

  //Seek
  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  //Volume
  const changeVolume = (value) => {
    const vol = Number(value);
    audioRef.current.volume = vol;
    setVolume(vol);
  };
  // Sync time
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const setMeta = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setMeta);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setMeta);
    };
  }, []);
};

return (
  <PlayerContext.Provider
    value={{
      currentSong,
      isPlaying,
      currentTime,
      duration,
      volume,
      queue,
      playSong,
      togglePlay,
      playNext,
      playPrev,
      seek,
      changeVolume,
    }}
  >
    {children}
  </PlayerContext.Provider>
);
