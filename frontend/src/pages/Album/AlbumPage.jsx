import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongCard from "../../components/Song/SongCard";
import { getAlbumById } from "../../services/musicServices";
import "./AlbumPage.css";

const AlbumPage = () => {
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getAlbumById(albumId);
        setAlbum(res || null);
      } catch (error) {
        console.error("Error fetching album:", error);
        setError("Failed to load album.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  if (loading) {
    return <div className="album-page">Loading album...</div>;
  }

  if (error) {
    return <div className="album-page">{error}</div>;
  }

  if (!album) {
    return <div className="album-page">Album not found.</div>;
  }

  return (
    <div className="album-page">
      <div className="album-hero">
        <img src={album.imageUri} alt={album.title} className="album-cover" />

        <div className="album-meta">
          <p className="album-label">ALBUM</p>
          <h1>{album.title}</h1>
          <p className="album-artist">{album.artist?.username}</p>
          <p className="album-description">
            {album.description || "An immersive collection of sound and mood."}
          </p>
          <span>{album.musics?.length || 0} tracks</span>
        </div>
      </div>

      <div className="album-tracks-section">
        <h2>Tracks</h2>

        <div className="songs-grid">
          {album.musics?.map((song) => (
            <SongCard key={song._id} song={song} songsList={album.songs} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
