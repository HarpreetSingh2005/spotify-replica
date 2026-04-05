import { useEffect, useState } from "react";
import SongCard from "../../components/Song/SongCard";
import AlbumCard from "../../components/Album/AlbumCard";
import TabSwitcher from "../../components/UI/TabSwitcher";

import usePlayer from "../../hooks/usePlayer";
import useDebounce from "../../hooks/useDebounce";

import {
  getAllMusic,
  getAllAlbums,
  searchMusic,
  searchAlbum,
} from "../../services/musicServices";
import "./Explore.css";
import SearchBar from "../../components/UI/SearchBar";

const Explore = () => {
  const { currentSong } = usePlayer();

  const [activeTab, setActiveTab] = useState("music");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [loadingSongs, setLoadingSongs] = useState(false);
  const [loadingAlbums, setLoadingAlbums] = useState(false);

  const [errorSongs, setErrorSongs] = useState("");
  const [errorAlbums, setErrorAlbums] = useState("");

  //Music GET/SEARCH
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoadingSongs(true);
        setErrorSongs("");
        console.log("Searching music for:", debouncedSearch);
        const res = debouncedSearch
          ? await searchMusic(debouncedSearch, 1, 20)
          : await getAllMusic(1, 20);

        setSongs(res || []);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setErrorSongs("Failed to load music.");
      } finally {
        setLoadingSongs(false);
      }
    };

    if (activeTab === "music") {
      fetchSongs();
    }
  }, [debouncedSearch, activeTab]);

  //ALBUMS GET/SEARHCH
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoadingAlbums(true);
        setErrorAlbums("");

        const res = debouncedSearch
          ? await searchAlbum(debouncedSearch, 1, 20)
          : await getAllAlbums(1, 20);

        setAlbums(res || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setErrorAlbums("Failed to load albums.");
      } finally {
        setLoadingAlbums(false);
      }
    };

    if (activeTab === "albums") {
      fetchAlbums();
    }
  }, [debouncedSearch, activeTab]);

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

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={
            activeTab === "music" ? "Search songs..." : "Search albums..."
          }
        />
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
                {songs.length > 0 ? (
                  songs.map((song) => (
                    <SongCard key={song._id} song={song} songsList={songs} />
                  ))
                ) : (
                  <p className="explore-message">No songs found.</p>
                )}
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
                {albums.length > 0 ? (
                  albums.map((album) => (
                    <AlbumCard key={album._id} album={album} />
                  ))
                ) : (
                  <p className="explore-message">No albums found.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
