import { use, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");

  return context;
};

export default usePlayer;
// A shortcut to access PlayerContext cleanly, which makes our app architecture easier to read.

//This must be within the PlayerProvider as it uses PlayerContext and outside that, he cant access the context.
