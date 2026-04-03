import { Link } from "react-router-dom";
import "./AlbumCard.css";

const AlbumCard = ({ album }) => {
  return (
    <Link to={`/album/${album._id}`} className="album-card">
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
    </Link>
  );
};

export default AlbumCard;
