import axios from "axios";
import { Track } from "./tracks";
import { useState, createContext, useContext, useEffect } from 'react';
import { UserContext } from "./login";

export class Playlist {
    _name: string;
    _id: number;
    _tracks: { [trackId: number]: Track } = {};

    constructor(id: number, name: string) {
        this._name = name;
        this._id = id;
    }
    
    addTrack(track: Track) : void {
        this._tracks[track.id] = track;
    }
    
    hasTrack(track: Track) : boolean {
        return !!(this._tracks[track._id]);
    }

    // Immutable pretty please :pleading_face:
    get tracks(): { [trackId: number]: Track } {
        return this._tracks;
    }

    get id(): number {
        return this._id;
    }
}

export const PlaylistContext = createContext({
    playlists: [],
});

export function PlaylistState() {
    const [playlists, setPlaylists] = useState([]);
    const {user, userActions} = useContext(UserContext);

    const token = user.token;
    console.log("playlist: user token", token);

    const http = axios.create({
        // baseURL: "balls.itch/api",
        headers: {
            "Content-type" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });

    useEffect(() => {
        Promise.all([
            http.get("/api/playlists/get")
        ])
        .then(([resPlaylists]) => 
            Promise.all([resPlaylists])
        )
        .then(([resPlaylists]) => {
            console.log("Got playlists:", resPlaylists);
        });
    }, []);

    return {
        playlists
    }
}