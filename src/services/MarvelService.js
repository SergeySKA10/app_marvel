export default class MarvelService {
    constructor(api) {
        this._apiKey = api;
    }
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';

    getResource = async (url) => {
        let result = await fetch(url);

        if (!result.ok) {
            throw new Error (`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
    }

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&apikey=${this._apiKey}`);
    }

    getCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);
    }
}