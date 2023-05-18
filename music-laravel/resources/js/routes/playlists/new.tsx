import { PlaylistList } from '@/components/player/PlaylistList';
import React from "react";
import { Playlist, PlaylistContext, PlaylistState } from '@/what/playlists';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { Track } from '@/what/tracks';
import PlaylistTracks from '@/components/player/TrackList';

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

interface NewTrackData {
    url: string,
    author: string | null,
    name: string | null
}

const initialData : NewTrackData = {
    url: "",
    author: "",
    name: "",
};

interface IPAction {
  type: "addTrack" | "removeTrack",
  val: any
}

interface IProps {
  playlist: Playlist,
  addingTrack: boolean,
  doAction: (i: IPAction) => void;
}

function NewTrackEntry({ playlist, addingTrack, doAction } : IProps) {
    
    const [ 
        {url, author, name},
        setData
    ] : [NewTrackData, any] = React.useState(initialData);

    if (!addingTrack) return;

    // ew
    const onChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const resetInput = () => {
        setData({ ...initialData });
    }

    const submitTrack = () => {
        var track = new Track(-1);
        track.url = url;
        track.name = name ?? track.name;
        track.author = author ?? track.author;

        var [can, why] = track.canCommit();
        if (!can) {
            console.log("Can't submit:", why);
            return;
        }

        var ok = track.commitToServer();
    
        ok.then((res) => {
          doAction({ type: "addTrack", val: track });
          resetInput();
        }, (err) => {
            console.log("err while committing", err);
        })
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
                name="url"
                onChange={onChange}
            />

            <div className="w-full flex flex-row justify-around">
            <input className="musTextField font-bold h-8
                mb-2 w-full shadow-md rounded-l-md rounded-r-none border-r-0"
                placeholder="Track author"
                value={author}
                name="author"
                onChange={onChange}
            />

            <input className="musTextField font-bold h-8
                mb-2 w-full shadow-md"
                placeholder="Track name"
                value={name}
                name="name"
                onChange={onChange}
            />
            </div>

            <button className="musBtnElevatedGreen mr-0 ml-auto">
                Confirm
            </button>
        </form>
    </>)
}

export function NewPlaylist({ panel }) {
  const { pnl, setPnl } = panel;
  const [addingTrack, setAddingTrack] = React.useState(false);

  const [playlist] = React.useState(() => {
    return new Playlist(-1, "New Playlist");
  });

  const [_, plAction] = React.useReducer((s, action: {type: string, val: any}) => {
    if (action.type == "addTrack") {
      playlist.addTrack(action.val);
      return s + 1;
    }
    
    if (action.type == "removeTrack") {
      playlist.removeTrack(action.val);
      return s + 1;
    }

    return s;
  }, 0);

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
        <NewTrackEntry playlist={playlist} addingTrack={addingTrack} doAction={plAction} />
        <PlaylistTracks playlist={playlist} addingTrack={addingTrack}/>
      </div>
    </div>
  </> )
}