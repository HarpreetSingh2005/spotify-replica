import React from "react";
import api from "../../lib/axios";
import { useState, useEffect } from "react";

const Explore = () => {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get("/music");
        console.log(res.data.musics);
        setSongs(res.data.musics);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div>
      {songs.map((song) => (
        <div key={song.id}>
          <h1>{song.title}</h1>
          <audio controls>
            <source src={song.url} type="audio/mp3" />
            {/* Your browser does not support the audio element. */}
          </audio>
        </div>
      ))}
    </div>
  );
};

export default Explore;
