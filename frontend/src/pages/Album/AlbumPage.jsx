import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import SongCard from "../../components/Song/SongCard";
import { getAlbumById } from "../../services/musicServices";
import usePlayer from "../../hooks/usePlayer";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

import "./AlbumPage.css";

const AlbumPage = () => {
  const { albumId } = useParams();
  const { currentSong } = usePlayer();
  
  const [albumData, setAlbumData] = useState(null);
  const albumRef = useRef(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchItems = useCallback(async (currentPage) => {
    let fetchedAlbum = albumRef.current;
    if (!fetchedAlbum) {
      fetchedAlbum = await getAlbumById(albumId);
      albumRef.current = fetchedAlbum;
      setAlbumData(fetchedAlbum);
      setInitialLoading(false);
    }
    const limit = 10;
    const startIndex = (currentPage - 1) * limit;
    return fetchedAlbum?.musics?.slice(startIndex, startIndex + limit) || [];
  }, [albumId]);

  const { data: items, loading, error, lastElementRef } = useInfiniteScroll(
    fetchItems,
    [albumId]
  );

  if (initialLoading && !albumData) {
    return <div className="album-page">Loading album...</div>;
  }

  if (error && !albumData) {
    return <div className="album-page">{error}</div>;
  }

  if (!albumData) {
    return <div className="album-page">Album not found.</div>;
  }

  // Dynamic Background
  const bgImage = currentSong ? currentSong.imageUri : albumData.imageUri;

  return (
    <div className="album-page">
      {bgImage && (
        <div
          className="album-bg-dynamic"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className="album-bg-overlay"></div>

      <div className="album-content" style={{ position: "relative", zIndex: 10 }}>
        <div className="album-hero">
          <img src={albumData.imageUri} alt={albumData.title} className="album-cover" />

          <div className="album-meta">
            <p className="album-label">ALBUM</p>
            <h1>{albumData.title}</h1>
            <p className="album-artist">{albumData.artist?.username}</p>
            <p className="album-description">
              {albumData.description || "An immersive collection of sound and mood."}
            </p>
            <span>{albumData.musics?.length || 0} tracks</span>
          </div>
        </div>

        <div className="album-tracks-section">
          <h2>Tracks</h2>

          <div className="songs-grid">
            {items.map((song, index) => {
              if (items.length === index + 1) {
                return (
                  <div ref={lastElementRef} key={song._id}>
                    <SongCard song={song} songsList={albumData.musics} />
                  </div>
                );
              } else {
                return (
                  <SongCard key={song._id} song={song} songsList={albumData.musics} />
                );
              }
            })}
          </div>

          {loading && (
            <div className="album-loading-container">
              <div className="album-custom-spinner"></div>
              <p className="explore-message">Loading tracks...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
