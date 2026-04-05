import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AlbumCard.css";

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  const handleAlbumClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      navigate(`/album/${album._id}`);
    }
  };

  return (
    <div onClick={handleAlbumClick} className="album-card" style={{ cursor: "pointer" }}>
      <div className="album-card-image-wrapper">
        <img
          src={album.imageUri}
          alt={album.title}
          className="album-card-image"
        />
        <div className="album-card-overlay"></div>
      </div>

      <div className="album-card-content">
        <h3>{album.title}</h3>
        <p>{album.artist?.username || "Unknown Artist"}</p>
        <span>{album.songs?.length || 0} tracks</span>
      </div>
    </div>
  );
};

export default AlbumCard;
