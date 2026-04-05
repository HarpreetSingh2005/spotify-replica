import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SongCard from "../../components/Song/SongCard";
import AlbumCard from "../../components/Album/AlbumCard";
import TabSwitcher from "../../components/UI/TabSwitcher";

import usePlayer from "../../hooks/usePlayer";
import useDebounce from "../../hooks/useDebounce";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

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
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab Sync
  const activeTab = searchParams.get("tab") === "albums" ? "albums" : "music";

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Define fetch handler
  const fetchItems = useCallback(
    async (currentPage) => {
      const limit = 10;
      let res;
      if (activeTab === "music") {
        res = debouncedSearch
          ? await searchMusic(debouncedSearch, currentPage, limit)
          : await getAllMusic(currentPage, limit);
      } else {
        res = debouncedSearch
          ? await searchAlbum(debouncedSearch, currentPage, limit)
          : await getAllAlbums(currentPage, limit);
      }
      return res; // Assuming backend returns array of items directly based on musicServices logic
    },
    [activeTab, debouncedSearch]
  );

  // Hook handles data, page tracking, and observer attachment
  const { data: items, loading, error, lastElementRef } = useInfiniteScroll(
    fetchItems,
    [activeTab, debouncedSearch]
  );

  // Tab Click Handler
  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab });
    setSearchTerm(""); // Reset search term when switching tabs
  };

  // Search input change handler
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

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

        <TabSwitcher activeTab={activeTab} setActiveTab={handleTabChange} />

        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={
            activeTab === "music" ? "Search songs..." : "Search albums..."
          }
        />
        
        <h2 className="explore-section-title">
          {activeTab === "music" ? "Trending Right Now" : "Featured Albums"}
        </h2>
        
        {error && <p className="explore-message error">{error}</p>}

        <div className="songs-grid">
          {activeTab === "music" ? (
            items.length > 0 ? (
              items.map((song, index) => {
                if (items.length === index + 1) {
                  return <div ref={lastElementRef} key={song._id}><SongCard song={song} songsList={items} /></div>;
                } else {
                  return <SongCard key={song._id} song={song} songsList={items} />;
                }
              })
            ) : (
              !loading && <p className="explore-message">No songs found.</p>
            )
          ) : (
            items.length > 0 ? (
              items.map((album, index) => {
                if (items.length === index + 1) {
                  return <div ref={lastElementRef} key={album._id}><AlbumCard album={album} /></div>;
                } else {
                  return <AlbumCard key={album._id} album={album} />;
                }
              })
            ) : (
              !loading && <p className="explore-message">No albums found.</p>
            )
          )}
        </div>

        {/* Loading Spinner for Infinite Scroll */}
        {loading && (
          <div className="explore-loading-container">
            <div className="explore-custom-spinner"></div>
            <p className="explore-message">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
