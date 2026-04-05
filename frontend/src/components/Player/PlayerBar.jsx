import usePlayer from "../../hooks/usePlayer";
import "./PlayerBar.css";

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrev,
    seek,
    changeVolume,
  } = usePlayer();

  // format seconds → mm:ss
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";

    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Hide player if no song selected
  if (!currentSong) return null;

  return (
    <div className="player-bar">
      {/* LEFT — SONG INFO */}
      <div className="player-left">
        <img
          src={currentSong.imageUri}
          alt={currentSong.title}
          className="player-cover"
        />
        <div className="player-song-info">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist?.username || "Unknown Artist"}</p>
        </div>
      </div>

      {/* CENTER — CONTROLS */}
      <div className="player-center">
        <div className="player-controls">
          <button onClick={playPrev}>⏮</button>
          <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
          <button onClick={playNext}>⏭</button>
        </div>

        <div className="player-progress">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="progress-slider"
            style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT — VOLUME */}
      <div className="player-right">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className="volume-slider"
          style={{ "--vol": `${volume * 100}%` }}
        />
      </div>
    </div>
  );
};

export default PlayerBar;
