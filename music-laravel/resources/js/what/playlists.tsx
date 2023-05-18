import axios from "axios";
import { Track } from "./tracks";
import { useState, createContext, useContext, useEffect } from 'react';
import { UserContext } from "./login";

export class Playlist {
    public name: string;
    _id: number;
    _tracks: { [trackId: number]: Track } = {};

    constructor(id: number, name: string) {
        this.name = name;
        this._id = id;

        for (var i = 0; i < 5; i++) {
            var trk = new Track(i);
            trk.name = "Track " + i;

            this.addTrack(trk)
        }
    }
    
    addTrack(track: Track) : void {
        this._tracks[track.id] = track;
    }

    removeTrack(track: Track) : void {
        delete this._tracks[track.id];
    }

    removeTrackById(id: number) : void {
        delete this._tracks[id];
    }
    
    hasTrack(track: Track) : boolean {
        return !!(this._tracks[track._id]);
    }

    getTrack(id: number) : Track | null {
        return this._tracks[id];
    }

    // Immutable tracklist pretty please :pleading_face:
    get tracks(): { [trackId: number]: Track } {
        return this._tracks;
    }

    get id(): number {
        return this._id;
    }

    set id(v: number) {
        if (this._id != -1) {
            console.error("Can't set ID of a non-fake playlist (ID != -1)");
            return;
        }

        this._id = v;
    }
}

export const PlaylistContext = createContext({
    playlists: [],
    fetching: false,
});

export function PlaylistState() {
    const [playlists, setPlaylists] = useState([]);
    const [fetchingPlaylists, setFetchingPlaylists] = useState(true);
    
    const {user, userActions} = useContext(UserContext);

    var playlistState = {
        playlists: playlists,
        fetching: fetchingPlaylists
    }

    const http = axios.create({
        // baseURL: "balls.itch/api",
        headers: {
            "Content-type" : "application/json",
        }
    });

    useEffect(() => {
        setFetchingPlaylists(true);
        Promise.all([
            user ? http.get("/api/playlists/list") : null,
            http.get("/api/playlists/listPublic")
        ])
        .then(([resPlaylists, resPublicPlaylists]) => {
            setFetchingPlaylists(false);
            console.log("Got playlists:", resPlaylists);
            console.log("Public playlists:", resPublicPlaylists)

            let ps : (Playlist)[] = []

            for (var i = 0; i < 50; i+=3) {
                ps.push(...[
                    new Playlist(i + 1, "songs to do the thug shaker to"),
                    new Playlist(i + 2, "derek di mashups"),
                    new Playlist(i + 3, "pizza tower OST"),
                ]);
            }

            console.log(ps);
            setPlaylists(ps)
        });
    }, []);

    return {
        playlists,
        fetchingPlaylists,
        playlistState
    }
}