import { Playlist, PlaylistContext, PlaylistState } from "../../what/playlists";
import React from "react";

function ShowLoadedList() {
    const { playlists } = React.useContext(PlaylistContext);

    return (<>
        {playlists.map((pl: Playlist) => (
            <React.Fragment key={pl.id}>
                <button className="playlistOption h-auto min-h-[2rem] w-full">
                    { pl.name }
                </button>
            </React.Fragment>
            
        ))}
    </>)
}

export function PlaylistList() {
    

    return (<>
        <div className="overflow-y-auto w-full pr-2">
            <ShowLoadedList />
        </div>
    </>)
}