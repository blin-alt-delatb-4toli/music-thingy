import axios, { AxiosResponse } from "axios";
import { Track } from "./tracks";
import { useState, createContext, useContext, useEffect, useReducer } from 'react';
import { UserContext } from "./login";

const http = axios.create({
    // baseURL: "balls.itch/api",
    headers: {
        "Content-type" : "application/json",
    }
});

interface ITrackList {
    [trackId: number]: Track
}

export class Playlist {
    public name: string;
    public publicity: number = 0;
    public fetchingTracks: boolean = false;
    public fetchedTracks: boolean = false;

    _id: number;
    _tracks: { [trackId: number]: Track } = {};
    
    constructor(id: number, name: string) {
        this.name = name;
        this._id = id;
    }
    
    commit() : Promise<AxiosResponse<any>> {
        if (!this.exists()) {
            // fake playlist; create it, self-assign id
            return http.post("/api/playlists/new", {
                name: this.name,
            }).then((res) => {
                this._id = res.data.id;
                return res;
            });
        } else {
            // existing playlist; just edit ourselves
            return http.post("/api/playlists/edit", {
                name: this.name,
                id: this._id,
            });
        }
    }

    exists() : boolean {
        return this._id >= 0;
    }

    commitAddTrack(track: Track) : Promise<AxiosResponse<any>> {
        console.assert(this.id >= 0);

        return http.post("/api/playlists/addTrack", {
            id: this._id,
            trackId: track.id,
        });
    }

    fetchTracks() : Promise< ITrackList > {
        console.assert(this.id >= 0);
        
        this.fetchingTracks = true;

        return http.get("/api/playlists/getTracks", {
            params: {
                id: this._id, // hilarious. really funny.
            }
        }).then((res) => {
            var tracks : ITrackList = {};

            console.log(res.data);

            for (var dat of res.data.tracks) {
                var trk = Track.fromResp(dat);
                tracks[trk.id] = trk;
            }

            this.fetchingTracks = false;
            this.fetchedTracks = true;
        
            this._tracks = tracks;

            return tracks;
        });
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
    setPlaylists: () => { console.error("too early"); } // wtf
});

export function PlaylistState() {
    const [playlists, setPlaylists] = useState([]);
    const [fetchingPlaylists, setFetchingPlaylists] = useState(true);
    
    const {user, userActions} = useContext(UserContext);

    var playlistState = {
        playlists: playlists,
        fetching: fetchingPlaylists,
        setPlaylists: (newPls) => { setPlaylists(newPls) }
    }

    const http = axios.create({
        // baseURL: "balls.itch/api",
        headers: {
            "Content-type" : "application/json",
            "Accept": "application/json",
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
            // console.log("Got playlists:", resPlaylists);
            // console.log("Public playlists:", resPublicPlaylists)

            var ps : (Playlist)[] = []
            
            if (resPlaylists) {
                var resPls = resPlaylists.data;

                for (var plDat of resPls) {
                    var pl = new Playlist(plDat.id, plDat.name);
                    pl.publicity = plDat.publicity;

                    ps.push(pl)
                }
            }
            
            setPlaylists(ps)
        });
    }, []);

    return {
        playlists,
        setPlaylists,
        fetchingPlaylists,
        playlistState
    }
}