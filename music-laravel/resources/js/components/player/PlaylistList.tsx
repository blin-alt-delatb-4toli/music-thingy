import { PlaylistState } from "../../what/playlists";

export function PlaylistList() {
    const {playlists} = PlaylistState();
    console.log("PlaylistList =>", playlists);

    return (<>
    <div className="overflow-y-scroll h-full">

    </div>    
    </>)
}