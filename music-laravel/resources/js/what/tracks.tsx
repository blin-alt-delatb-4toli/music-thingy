export class Track {
    _name: string;
    _id: number;
    _url: string | null | undefined; // TODO: is null even useful?
    
    constructor(id: number, name: string) {
        this._name = name;
        this._id = id;
    }



    get id(): number {
        return this._id;
    }
}