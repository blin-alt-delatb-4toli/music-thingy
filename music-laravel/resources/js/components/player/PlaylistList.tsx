import { Playlist, PlaylistContext, PlaylistState } from "../../what/playlists";
import React from "react";

interface IProps {
    panel: {
        pnl: {type: string, val: any},
        setPnl: (s: {type: string, val: any}) => null
    }
}

function ShowLoadedList({ panel } : IProps) {
    const { playlists } = React.useContext(PlaylistContext);
    console.log("ShowLoadedList update", playlists);

    const selectPlaylist = (pl: Playlist) => {
        panel.setPnl({type: "Selected", val: pl});
    }

    return (<>
        {playlists.map((pl: Playlist) => (
            <React.Fragment key={pl.id}>
                <button id={pl.id}
                className="playlistOption h-auto min-h-[2rem] w-full"
                onClick={(e) => { selectPlaylist(pl); }}>
                    { pl.name }
                </button>
            </React.Fragment>
            
        ))}
    </>)
}

export function PlaylistList({ panel } : IProps) {
    return (<>
        <div className="overflow-y-auto w-full pr-2">
            <ShowLoadedList panel={panel}/>
        </div>
    </>)
}