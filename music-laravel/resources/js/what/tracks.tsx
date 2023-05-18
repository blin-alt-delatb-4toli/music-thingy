import axios, { AxiosResponse } from "axios";

const http = axios.create({
    // baseURL: "balls.itch/api",
    headers: {
        "Content-type" : "application/json",
    }
});

export class Track {
    public name: string | null = null;
    public author: string | null = null;

    _id: number;
    url: string | null | undefined; // TODO: is null even useful?
    
    constructor(id: number) {
        this._id = id;
    }

    canCommit() : [boolean, string?] {
        if (!this.url) {
            return [false, "Missing URL"];
        }

        return [true];
    }

    commitToServer() : Promise<AxiosResponse<any>> {
        var [can, why] = this.canCommit();
        console.assert(can);
        
        return http.post("/api/tracks/new", {
            url: this.url,
            name: this.name,
            author: this.author
        }).then((dat) => {
            this._id = dat.data.id;
            return dat;
        });
    }

    get id(): number {
        return this._id;
    }
}