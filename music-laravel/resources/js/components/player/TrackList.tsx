import { ITrackList, Playlist, PlaylistContext } from "@/what/playlists";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faDownload, faEdit, faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { SelectedPlaylistContext, ISelectedPlaylistContext } from "@/routes/playlists/details";
import { Track } from "@/what/tracks";

function IconButton({ action, icon }) {
  return (<>
    <button onClick={action} className="w-auto h-full">
      <FontAwesomeIcon icon={icon} className="trackAction my-auto ml-1.5 w-auto h-full"/>
    </button>
  </>)
}

interface IProps {
  track: Track,
  playlist: Playlist,
  setTracks: (t: ITrackList) => null,
}

function TrackEntry({ playlist, track, setTracks } : IProps) {
  const deleteTrack = async () => {
    await playlist.commitRemoveTrack(track);
    console.log("commited remove, tracks =>", playlist.tracks);
    setTracks({...playlist.tracks});
  }

  const downloadTrack = () => {
    console.log("Download: Not implemented");
  }

  const editTrack = () => {
    console.log("Edit: Not implemented");
  }

  return (<>
    <div className="trackEntry min-h-[3.5rem] h-14 flex flex-row items-center pl-2">
      <button className="w-full h-full flex flex-row">
        <img src={"https://i1.sndcdn.com/artworks-000481006050-6evvmj-t500x500.jpg"
          /*"https://cataas.com/cat?width=64&a=" + Math.random()*/ }
          className="w-12 h-12 my-1"/>
  
        { /* i pray that flexboxes aren't that expensive and that
            having 3 flexboxes per each track is fine... */ }
        <div className="w-auto h-full flex flex-col justify-center items-start flex-grow">
          <span className="trackName"> {track.name} </span>
          <span className="trackAuthor"> {track.author} </span>
        </div>
      </button>

      <div className="trackDetails cursor-default text-sm w-auto h-full
        flex flex-col justify-center items-start px-2">
        <div className="h-6 flex items-center ml-auto pt-1">
          <FontAwesomeIcon icon={faClock} className="h-[75%]"/>
          <span className="ml-1 my-auto font-medium text-base leading-none">4:20</span>
        </div>
        
        <div className="h-5 flex mt-auto pb-1 w-full flex-row items-center justify-end">
          <IconButton icon={faDownload} action={downloadTrack}/>
          {playlist.canEdit() ? <IconButton icon={faTrashCan} action={deleteTrack}/> : null}
          {playlist.canEdit() ? <IconButton icon={faEdit} action={editTrack}/> : null}
        </div>
      </div>
    </div>
  </>)
  }

export default function PlaylistTracks({ playlist, addingTrack } 
    : { playlist: Playlist, addingTrack: boolean }) {
  
    // We'll be mutating the same tracklist (because it's fucking sane)
    // So we'll just use the `playlist` from the parent state
    // and use `forceUpdate` to force a re-render of the tracklist
    // (because React compares shallowly, so we'd need to make a copy to mutate)
    
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const { tracks, setTracks } : ISelectedPlaylistContext = React.useContext(SelectedPlaylistContext);
    
    if (!playlist.fetchedTracks && playlist.exists()) {
      playlist.fetchTracks().then(() => {
        setTracks({...playlist.tracks});
        forceUpdate()
      });
    }

    return (<>
      {/* Draw the existing tracklist of ones that are in already */}

      {
        playlist.fetchingTracks ? (<>
          <div className="mx-auto font-sans font-normal italic">
            updating...
          </div>
        </>) : null
      }

      { Object.entries(tracks).map(([tID, track]) => (
      <React.Fragment key={tID}>
        <TrackEntry playlist={playlist} track={track} setTracks={setTracks} />
      </React.Fragment>))
      }
    </>)
  }