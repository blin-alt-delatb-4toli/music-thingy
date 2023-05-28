import { PlaylistList } from '../components/player/PlaylistList';
import React from "react";
import { Playlist, PlaylistContext, PlaylistState } from '../what/playlists';
import { PlaylistDetails } from './playlists/details';

interface IPanelState {
  type: string,
  val?: any
}

interface IPanel {
  pnl: IPanelState,
  setPnl: (s: IPanelState) => null
}

interface IPropPanel {
  panel: IPanel
}

function Header({ panel } : IPropPanel) {
  const { pnl, setPnl } = panel;
  const { fetching } = React.useContext(PlaylistContext);

  const onNew = () => {
    setPnl({
      type: "New",
      val: new Playlist(-1, "New Playlist")
    });
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

var FUCK = 0;

export function Playlists() {
  const {playlistState} = PlaylistState();
  const [pnl, setPnl] = React.useState({type: "none"});
  const playlist = pnl.val;

  if (playlist) {
    FUCK++;
    playlist.I_HATE_EVERYTHING_ABOUT_YOU ??= FUCK;
  }

  return (
    <PlaylistContext.Provider value={playlistState}>
      <div className="flex flex-row h-full">
        { /* Scroll */ }
        <div className="min-w-[16rem] w-[20%] sm:max-w-md playlistScroll">
          <div className="flex flex-col max-h-[calc(100vh-3rem)] flex-auto">
            <Header panel={{pnl, setPnl}}/>
            <div className="pl-8 overflow-auto">
              <PlaylistList panel={{pnl, setPnl}}/>
            </div>
          </div>
        </div>

        { /* Right panel thing */ }
        <React.Fragment key={playlist?.I_HATE_EVERYTHING_ABOUT_YOU ?? "none"}>
        <div className="flex flex-col flex-auto h-full lg:px-[calc((100%-1024px)*0.1)]">
            <PlaylistDetails panel={{pnl, setPnl}}/>
        </div>
        </React.Fragment>
      </div>
    </PlaylistContext.Provider>
  )
}