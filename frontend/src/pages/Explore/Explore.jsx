import { useEffect, useState } from "react";
import SongCard from "../../components/Song/SongCard";
import AlbumCard from "../../components/Album/AlbumCard";
import TabSwitcher from "../../components/UI/TabSwitcher";
import usePlayer from "../../hooks/usePlayer";
import { getAllMusic, getAllAlbums } from "../../services/musicServices";
import "./Explore.css";

const Explore = () => {
  const { currentSong } = usePlayer();

  const [activeTab, setActiveTab] = useState("music");

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [loadingSongs, setLoadingSongs] = useState(false);
  const [loadingAlbums, setLoadingAlbums] = useState(false);

  const [errorSongs, setErrorSongs] = useState("");
  const [errorAlbums, setErrorAlbums] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoadingSongs(true);
        setErrorSongs("");

        const res = await getAllMusic(1, 10);
        setSongs(res || []);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setErrorSongs("Failed to load music.");
      } finally {
        setLoadingSongs(false);
      }
    };

    fetchSongs();
  }, []);
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoadingAlbums(true);
        setErrorAlbums("");

        const res = await getAllAlbums(1, 20);
        setAlbums(res || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setErrorAlbums("Failed to load albums.");
      } finally {
        setLoadingAlbums(false);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="explore-page">
      {currentSong && (
        <div
          className="explore-bg-dynamic"
          style={{ backgroundImage: `url(${currentSong.imageUri})` }}
        />
      )}

      <div className="explore-bg-overlay"></div>

      <div className="explore-content">
        <div className="explore-header">
          <p className="explore-kicker">DISCOVER SOUND</p>
          <h1>Explore Music</h1>
          <p className="explore-subtext">
            A curated world of songs, moods, and cinematic listening.
          </p>
        </div>

        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

        <h2 className="explore-section-title">
          {activeTab === "music" ? "Trending Right Now" : "Featured Albums"}
        </h2>
        {/* MUSIC TAB */}
        {activeTab === "music" && (
          <>
            {loadingSongs && (
              <p className="explore-message">Loading songs...</p>
            )}
            {errorSongs && (
              <p className="explore-message error">{errorSongs}</p>
            )}

            {!loadingSongs && !errorSongs && (
              <div className="songs-grid">
                {songs.map((song) => (
                  <SongCard key={song._id} song={song} songsList={songs} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ALBUMS TAB */}
        {activeTab === "albums" && (
          <>
            {loadingAlbums && (
              <p className="explore-message">Loading albums...</p>
            )}
            {errorAlbums && (
              <p className="explore-message error">{errorAlbums}</p>
            )}

            {!loadingAlbums && !errorAlbums && (
              <div className="songs-grid">
                {albums.map((album) => (
                  <AlbumCard key={album._id} album={album} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
