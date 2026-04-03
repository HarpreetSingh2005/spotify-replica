import usePlayer from "../../hooks/usePlayer";
import "./SongCard.css";

const SongCard = ({ song, songsList }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const isCurrentSong = currentSong?._id === song._id;

  const handleSongClick = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, songsList);
    }
  };

  return (
    <div
      className={`song-card ${isCurrentSong ? "active-song" : ""}`}
      onClick={handleSongClick}
    >
      <div className="song-card-image-wrapper">
        <img src={song.imageUri} alt={song.title} className="song-card-image" />
        <div className="song-card-overlay"></div>

        <button
          className={`song-card-play-btn ${isCurrentSong ? "active" : ""}`}
        >
          {isCurrentSong && isPlaying ? "⏸" : "▶"}
        </button>
        {isCurrentSong && (
          <div className="now-playing-badge">
            {isPlaying ? "NOW PLAYING" : "PAUSED"}
          </div>
        )}
      </div>

      <div className="song-card-content">
        <h3>{song.title}</h3>
        <p>{song.artist?.username || "Unknown Artist"}</p>
      </div>
    </div>
  );
};

export default SongCard;
