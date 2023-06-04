import { PlaylistList } from '@/components/player/PlaylistList';
import React from "react";
import { Playlist, PlaylistContext, PlaylistState, ITrackList } from '@/what/playlists';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeLowVision, faEyeSlash, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { Track } from '@/what/tracks';
import PlaylistTracks from '@/components/player/TrackList';
import { Disclosure, Menu } from '@headlessui/react';
import { UserContext } from '@/what/login';

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

export interface ISelectedPlaylistContext {
  playlist: Playlist | null,
  tracks: ITrackList,
  setTracks: (trks: ITrackList) => null;
}

export const SelectedPlaylistContext = React.createContext({
  playlist: null,
  tracks: null,
});

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const visibilities = [ // key must match enum xoxo
  { icon: faEyeSlash, name: "Private", enum: 0},
  { icon: faEyeLowVision, name: "Unlisted", enum: 1 },
  { icon: faEye, name: "Public", enum: 2 },
];

function DetailsPanel({ playlist, panel } : { playlist: Playlist, panel: IPanel }) {
  const placeholderName = "New Playlist";
  const [ name, setName ] = React.useState(playlist.name || placeholderName);
  const { playlists, setPlaylists } = React.useContext(PlaylistContext);
  const [ pub, setPub ] = React.useState(playlist.publicity);
  const { user } = React.useContext(UserContext);

  playlist.name = name || placeholderName;

  const commitPlaylist = (e) => {
    e.preventDefault();
  
    return playlist.commit().then((e) => {
      if (!playlists.includes(playlist)) {
        playlists.push(playlist);
      }
  
      setPlaylists([
        ...playlists
      ]);

      return e;
    });
  }

  const changeVis = async (val) => {
    if (!playlist.exists()) {
      await playlist.commit();
    }

    await playlist.commitPublicity(val.enum);
    setPub(val.enum);
    // Update the playlists list because we may need to update the displayed list
    // (ie, if we're on the "public") tab and we just hid a playlist
    setPlaylists([ ...playlists ]);
  }

  const curVis = visibilities[pub];

  return (<>
    <div className="flex flex-col align-middle justify-stretch pl-4 py-2">
      <div className="w-full h-auto flex flex-row">
        
        <input className="musTextField font-bold text-2xl
          w-auto shadow-md disabled:shadow-none rounded-none rounded-l-md
          flex-grow h-auto"
          placeholder={placeholderName}
          value={playlist.name}
          disabled={!playlist.canEdit()}
          onChange={(e) => {
            setName(e.target.value || e.target.placeholder);
          } } />

        {playlist.canEdit() ? <button className="musBtnElevatedBlue
          rounded-l-none border-l-0
          mr-4 h-auto w-24
          flex items-center justify-center
          " onClick={commitPlaylist}>
            <FontAwesomeIcon icon={faSave} className="h-5 mr-1" />
            Save
        </button> : null}
      </div>

      <div className="px-4 my-1">
        <Menu as="div" className="relative ml-auto right-0">
        <Disclosure className="bg-gray-800">
          {({ open, close }) => ( <>
            { (!playlist.canEdit() && open) ? close() : null }
            <Disclosure.Button className={classNames(
                open
                  ? 'bg-gray-700 text-white'
                  : 'hover:bg-gray-700 hover:text-white',
                'px-3 h-full font-medium min-w-[120px] text-lg',
                'flex flex-row justify-center items-center'
              )}
              disabled={!playlist.canEdit()}>
              <FontAwesomeIcon icon={curVis.icon} className="mr-1" />
              {curVis.name}
            </Disclosure.Button>

            <Menu.Items className="musFrame absolute flex flex-col rounded-tl-none max-w-[256px] w-fit origin-top-right py-1">
              { visibilities.map( (value) => {
                return (<Menu.Item as="button" disabled={!user} key={value.name} className="w-auto px-0 mx-0 flex">
                  {({ active }) => (
                    <a className={ classNames(
                      "px-4 w-full mx-0 flex min-h-[32px] items-center justify-center",
                      active ? "bg-gray-200"
                             : "" ) }

                      onClick={(e) => {
                        changeVis(value);
                      }}
                    >

                      <FontAwesomeIcon
                        icon={value.icon}
                        className="mr-1"/>
                      {value.name}
                    </a>
                  )}
                </Menu.Item>)
              } ) }
            </Menu.Items>
            </>
          )}
        </Disclosure>
        </Menu>

      </div>
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
  addingTrack: boolean,
}

function NewTrackEntry({ addingTrack } : IProps) {
    const [ 
        {url, author, name},
        setData
    ] : [NewTrackData, any] = React.useState(initialData);

    const { playlists, setPlaylists } = React.useContext(PlaylistContext);
    const { playlist, tracks, setTracks } : ISelectedPlaylistContext = React.useContext(SelectedPlaylistContext);

    if (!addingTrack || !playlist) return;

    // ew
    const onChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const resetInput = () => {
        setData({ ...initialData });
    }

    const submitTrack = async () => {
        var track = new Track(-1);
        track.url = url;
        track.name = name ?? track.name;
        track.author = author ?? track.author;

        var [can, why] = track.canCommit();
        if (!can) {
            console.log("Can't submit:", why);
            return;
        }

        try {
          if (!playlist.exists()) {
            await playlist.commit();

            if (!playlists.includes(playlist)) {
              playlists.push(playlist);
            }
            
            setPlaylists([...playlists])
          }
        
          await track.commitToServer();
          resetInput(); // track created; now request adding it to the playlist

          await playlist.commitAddTrack(track);
          setTracks({...playlist.tracks});
        } catch (err) {
          console.error("err while committing", err);
        }
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

export function PlaylistDetails({ panel } : IPropPanel) {
  const [addingTrack, setAddingTrack] = React.useState(false);

  const playlist : Playlist = panel.pnl.val; // can be null!
  const [tracks, setTracks] = React.useState(playlist?.tracks ?? {});

  if (panel.pnl.type !== "New" && panel.pnl.type !== "Selected") {
    return (<> </>);
  }

  /*console.log("playlistdetails update");
  console.log(tracks);
  console.log(playlist.tracks);*/

  const ctx : ISelectedPlaylistContext = {
    playlist: playlist,

    tracks: tracks,
    setTracks: setTracks,
  }

  if (addingTrack && !playlist.canEdit()) {
    setAddingTrack(false);
  }

  return ( <>
    { /* Playlist name and such */ }
    <DetailsPanel playlist={playlist} panel={panel}/>
  
    <div className="bg-neutral-200 h-full p-4 py-2 flex flex-col">
      { /* Toolbar thingy above the tracklist */ }
      {playlist.canEdit() ? (<div className="min-h-[2.5rem] flex flex-row justify-center mr-0 ml-auto">
        <button className={
          "musBtnElevatedGreen w-fit h-auto "
          + (addingTrack ? "rounded-b-none mb-0 border-b-0" : "mb-1")
        }
          onClick={() => { setAddingTrack(!addingTrack); }}>
          <FontAwesomeIcon icon={faPlus} className="mr-1.5 scale-110" />
          Add track
        </button>
      </div>) : null}


      { /* Tracklist itself */ }
      <SelectedPlaylistContext.Provider value={ctx}>
        <div className="tracklistScroll h-full flex flex-col max-h-[calc(100vh-3rem)] flex-auto">
          <NewTrackEntry addingTrack={addingTrack} />
          <PlaylistTracks playlist={playlist} addingTrack={addingTrack}/>
        </div>
      </SelectedPlaylistContext.Provider>

    </div>
  </> )
}