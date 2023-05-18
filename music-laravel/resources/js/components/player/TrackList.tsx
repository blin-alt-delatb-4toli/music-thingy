import { Playlist } from "resources/js/what/playlists";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faEdit, faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

function TrackEntry({ playlist, track }) {
    return (<>
      <button className="trackEntry min-h-[3.5rem] h-14 flex flex-row items-center pl-2 overflow-y-scroll">
        <img src={"https://i1.sndcdn.com/artworks-000481006050-6evvmj-t500x500.jpg"
        /*"https://cataas.com/cat?width=64&a=" + Math.random()*/ }
        className="w-12 h-auto my-2"/>
  
        { /* i pray that flexboxes aren't that expensive and that
             having 3 flexboxes per each track is fine... */ }
        <div className="w-auto h-full flex flex-col justify-center items-start flex-grow">
          <span className="trackName"> {track.name} </span>
          <span className="trackAuthor"> {"Author name goes here"} </span>
        </div>
  
        <div className="trackDetails cursor-default text-sm w-auto h-full
        flex flex-col justify-center items-start px-2">
          <div className="h-6 flex items-center ml-auto pt-1">
            <FontAwesomeIcon icon={faClock} className="h-[75%]"/>
            <span className="ml-1 my-auto font-medium text-base leading-none">4:20</span>
          </div>
          
          <div className="h-5 flex mt-auto pb-1">
            <FontAwesomeIcon icon={faSave} className="trackAction my-auto ml-1.5 h-full"/>
            <FontAwesomeIcon icon={faTrashCan} className="trackAction my-auto ml-1.5 h-full"/>
            <FontAwesomeIcon icon={faEdit} className="trackAction my-auto ml-1.5 h-full"/>
          </div>
        </div>
      </button>
    </>)
  }

export default function PlaylistTracks({ playlist, addingTrack } 
    : { playlist: Playlist, addingTrack: boolean }) {
  
    // We'll be mutating the same tracklist (because it's fucking sane)
    // So we'll just use the `playlist` from the parent state
    // and use `forceUpdate` to force a re-render of the tracklist
    // (because React compares shallowly, so we'd need to make a copy to mutate)
  
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  
    return (<>
      {/* Draw the existing tracklist of ones that are in already */}
      { Object.entries(playlist.tracks).map(([tID, track]) => (
      <React.Fragment key={tID}>
        <TrackEntry playlist={playlist} track={track} />
      </React.Fragment>))
      }
    </>)
  }