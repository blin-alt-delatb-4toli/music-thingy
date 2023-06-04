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

export interface ITrackList {
    [trackId: number]: Track
}

export const PlaylistContext = createContext({
    playlists: [],
    fetching: false,
    setPlaylists: () => { console.error("too early"); } // wtf
});

export const Publicity = {
    Private: 0,
    Unlisted: 1,
    Public: 2,
}

export class Playlist {
    public name: string;
    public publicity: number = Publicity.Private;
    public ownerId: number = -1;
    public createTime: number = -1;
    public order: number = 0;
    public fetchingTracks: boolean = false;
    public fetchedTracks: boolean = false;

    _id: number;
    tracks: { [trackId: number]: Track } = {};
    
    constructor(id: number, name: string) {
        this.name = name;
        this._id = id;
    }
    
    commit() : Promise<AxiosResponse> {
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

    commitAddTrack(track: Track) : Promise<AxiosResponse> {
        console.assert(this.id >= 0);
        console.assert(track.id >= 0);

        return http.post("/api/playlists/addTrack", {
            id: this._id,
            trackId: track.id,
        }).then((yh) => {
            this.addTrack(track);
            return yh;
        });
    }

    commitRemoveTrack(track: Track) : Promise<AxiosResponse> {
        console.assert(this.id >= 0);
        console.assert(track.id >= 0);

        return http.post("/api/playlists/removeTrack", {
            id: this._id,
            trackId: track.id,
        }).then((yh) => {
            this.removeTrack(track);
            return yh;
        });
    }

    // this is super shit, but combats concurrent requests,
    // where they can finish out of order or with an error
    private _curPubToken : null[] = [];
    private _lastPub : number | null = null; // last successfully committed vis

    commitPublicity(vis: number) : Promise<AxiosResponse> {
        console.assert(this.id >= 0);
        console.assert(vis >= 0 && vis <= 2);

        var token = [];
        this._curPubToken = token;
        
        this._lastPub ??= this.publicity;

        return http.post("/api/playlists/changePub", {
            id: this._id,
            vis: vis,
        }).then((yh) => {
            if (this._curPubToken == token) { // we're the only remaining request, and just finished
                this.publicity = vis;
            }
            this._lastPub = vis;

            return yh;
        }, (err) => {
            // we errored; restore publicity to last known/commited one
            // This handles cases where first request finishes but doesnt set publicity
            // (due to second request existing), and second request fails
            // THIS ALSO SUCKS LMAO

            this.publicity = this._lastPub! // guaranteed not null due to setting it before the request
            throw err;
        });
    }

    fetchTracks() : Promise< ITrackList > {
        console.assert(this.id >= 0);
        
        this.fetchingTracks = true;

        return http.get("/api/playlists/getTracks", {
            params: { // hilarious. really funny. can't put headers into GET requests.
                id: this._id,
            }
        }).then((res) => {
            var tracks : ITrackList = {};

            for (var dat of res.data.tracks) {
                var trk = Track.fromResp(dat);
                tracks[trk.id] = trk;
            }

            this.fetchingTracks = false;
            this.fetchedTracks = true;
        
            this.tracks = tracks;

            return tracks;
        });
    }

    addTrack(track: Track) : void {
        this.tracks[track.id] = track;
    }

    removeTrack(track: Track) : void {
        delete this.tracks[track.id];
    }

    removeTrackById(id: number) : void {
        delete this.tracks[id];
    }
    
    hasTrack(track: Track) : boolean {
        return !!(this.tracks[track._id]);
    }

    getTrack(id: number) : Track | null {
        return this.tracks[id];
    }

    canEdit() : boolean {
        const { user } = useContext(UserContext);

        return user && (this._id < 0 || this.ownerId == user.id);
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

    const parseResponse = (resp, into) => {
        for (var plDat of resp) {
            var pl = new Playlist(plDat.id, plDat.name);
            pl.publicity = plDat.publicity;
            pl.ownerId = plDat.created_by;
            pl.order = plDat.order;
            pl.createTime = plDat.created_at;

            into[pl.id] = pl;
        }
    }

    const queryPlaylists = (offset?: number, pub?: boolean, search?: string) : Promise<AxiosResponse> => {
        var endpoint = pub ? "listPublic" : "list";

        return http.get("/api/playlists/" + endpoint, {
            params: {
                offset: offset,
                search: search,
            }
        })
    }
    
    useEffect(() => {
        // Only fetch the first batch automatically
        if (playlists.length > 0)
            return;

        setFetchingPlaylists(true);

        Promise.all([
            user ? queryPlaylists(0, false) : null,
            queryPlaylists(0, true)
        ])
        .then(([resPlaylists, resPublicPlaylists]) => {
            setFetchingPlaylists(false);

            var ps : { [id: number]: Playlist } = {}
            
            if (resPlaylists) {
                parseResponse(resPlaylists.data, ps);
            }

            if (resPublicPlaylists) {
                parseResponse(resPublicPlaylists.data, ps);
            }
            
            var psArr : Playlist[] = Object.values(ps);
            psArr.sort((a, b) => {
                if (a.order != b.order) {
                    return (a.order < b.order ? 1 : -1)
                }
                
                if (a.createTime != b.createTime) {
                    return (a.order < b.order ? 1 : -1)
                }

                return 0;
            })

            setPlaylists(psArr)
        }, (why) => {
            setFetchingPlaylists(false);
        });
    }, []);

    return {
        playlists,
        setPlaylists,
        fetchingPlaylists,
        playlistState,
        queryPlaylists
    }
}