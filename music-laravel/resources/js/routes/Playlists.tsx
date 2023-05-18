import { PlaylistList } from '../components/player/PlaylistList';
import React from "react";
import { Playlist, PlaylistContext, PlaylistState } from '../what/playlists';
import { NewPlaylist } from './playlists/new';

function Header({ panel }) {
  const { pnl, setPnl } = panel;
  const { fetching } = React.useContext(PlaylistContext);

  const onNew = () => {
    setPnl("New");
  }

  return (<>
      <h2 className="text-3xl font-bold m-2 mb-1 align-middle flex">
          Playlists

          <button className="musBtnElevatedGreen text-base h-8 ml-auto px-4 my-auto"
            onClick={onNew}>
            New
          </button>
      </h2>
      <h3>
        { fetching ? (
          <div className="hidden md:block ml-4 font-sans font-normal italic">
            updating...
          </div>
        ) : null }
      </h3>
  </>)
}

export function Playlists() {
  const {playlistState} = PlaylistState();
  const [pnl, setPnl] = React.useState();

  return (
    <PlaylistContext.Provider value={playlistState}>
      <div className="flex flex-row h-full">
        { /* Scroll */ }
        <div className="sm:w-[max(25%,300px)] sm:max-w-md playlistScroll">
          <div className="flex flex-col max-h-[calc(100vh-3rem)] flex-auto">
            <Header panel={{pnl, setPnl}}/>
            <div className="pl-8 overflow-auto">
              <PlaylistList />
            </div>
          </div>
        </div>

        { /* Right panel thing */ }
        <div className="flex flex-col flex-auto h-full">
            <NewPlaylist panel={{pnl, setPnl}}/>
        </div>
      </div>
    </PlaylistContext.Provider>
  )
}