const _api = process.env.REACT_APP_MY_API_KEY;

export default class MarvelService {
    constructor() {
        this._apiKey = _api;
    }
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';

    getResource = async (url) => {
        let result = await fetch(url);

        if (!result.ok) {
            throw new Error (`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&apikey=${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (data) => {
        return {
            name: data.name ? data.name : 'Герой не найден',

            description: !data.description ? 
                            'К сожалению, описание героя отсутствует': 
                            data.description.length > 60 ? 
                                    `${data.description.slice(0, 60)}...` : data.description,

            thumbnail: `${data.thumbnail.path}.${data.thumbnail.extension}`,
            homepage: data.urls[0].url,
            wiki: data.urls[1].url
        }
    }
}