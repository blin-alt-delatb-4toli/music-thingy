import { PlaylistList } from '../components/player/PlaylistList';
import React from "react";
import { Playlist, PlaylistContext, PlaylistState } from '../what/playlists';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { Track } from '../what/tracks';
import PlaylistTracks from '../components/player/TrackList';

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

function PlaylistDetails({ playlist }) {
  const [ name, setName ] = React.useState("New Playlist");
  const placeholderName = "New Playlist";

  playlist.name = name || placeholderName;

  return (<>
    <div className="flex align-middle justify-stretch">
      <input className="musTextField font-bold text-2xl
        my-2 ml-4 w-auto shadow-md rounded-none rounded-l-md
        flex-grow"
        placeholder={placeholderName}
        onChange={(e) => {
          setName(e.target.value || e.target.placeholder);
        } }
      />

      <button className="musBtnElevatedBlue
        rounded-l-none border-l-0
        my-2 mr-4 h-auto w-24
        flex items-center justify-center
        ">
          <FontAwesomeIcon icon={faSave} className="h-5 mr-1" />
          Save
      </button>
    </div>
  </>)
}

function NewTrackEntry({ playlist, addingTrack }) {
  const [ track ] = React.useState(() => {
    return new Track(-1, "New Track")
  });

  const [ url, setUrl ] = React.useState("");
  const [ author, setAuthor ] = React.useState("");
  const [ name, setName ] = React.useState("");

  if (!addingTrack) return;

  track.url = url;
  track.author = author;
  track.name = name;

  const submitTrack = () => {
    console.log("Submitting track...", track);
  }

  return (<>
    <form className="newTrackEntry h-auto flex flex-col items-center px-4 py-2"
     onSubmit={(e) => {
      e.preventDefault();
      submitTrack();
      } }>
      <input className="musTextField font-bold h-8
        mb-2 w-full shadow-md rounded-md"
        placeholder="Track URL (YouTube, Soundcloud, etc...)"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        } }
      />

    <div className="w-full flex flex-row justify-around">
      <input className="musTextField font-bold h-8
        mb-2 w-full shadow-md rounded-l-md rounded-r-none border-r-0"
        placeholder="Track author"
        value={author}
        onChange={(e) => {
          setAuthor(e.target.value);
        } }
      />

      <input className="musTextField font-bold h-8
        mb-2 w-full shadow-md"
        placeholder="Track name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        } }
      />
      </div>

      <button className="musBtnElevatedGreen mr-0 ml-auto">
        Confirm
      </button>
    </form>
  </>)
}

function NewPlaylist({ panel }) {
  const { pnl, setPnl } = panel;
  const [addingTrack, setAddingTrack] = React.useState(false);
  const [ playlist ] = React.useState(() => {
    return new Playlist(-1, "New Playlist")
  });

  if (pnl !== "New") {
    return (<> </>);
  }

  return ( <>
    <PlaylistDetails playlist={playlist}/>
  
    <div className="bg-neutral-200 h-full p-4 pt-2 flex flex-col">
      { /* Toolbar thingy above the tracklist*/ }
      <div className="min-h-[2.5rem] pt-1 flex flex-row justify-center mr-0 ml-auto">
        <button className={
          "musBtnElevatedGreen w-fit h-auto "
          + (addingTrack ? "rounded-b-none mb-0 border-b-0" : "mb-1")
        }
          onClick={() => { setAddingTrack(!addingTrack); }}>
          <FontAwesomeIcon icon={faPlus} className="mr-1.5 scale-110" />
          Add track
        </button>
      </div>

      { /* Tracklist itself */ }
      <div className="tracklistScroll h-full flex flex-col max-h-[calc(100vh-3rem)] flex-auto">
        <NewTrackEntry playlist={playlist} addingTrack={addingTrack} />
        <PlaylistTracks playlist={playlist} addingTrack={addingTrack}/>
      </div>
    </div>
  </> )
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