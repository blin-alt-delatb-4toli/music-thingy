export class Track {
    public name: string;
    public author: string | null = "";

    _id: number;
    _url: string | null | undefined; // TODO: is null even useful?
    
    constructor(id: number, name: string) {
        this.name = name;
        this._id = id;
    }

    get id(): number {
        return this._id;
    }
}