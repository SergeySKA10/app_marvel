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
        return this._transformCharacter(res.data.results);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);
        return this._transformCharacter(res.data.results);
    }

    _transformCharacter = (data) => {
        if (data.length === 1) {
            return {
                name: data[0].name ? data[0].name : 'Герой не найден',

                description: !data[0].description ? 
                                'К сожалению, описание героя отсутствует': 
                                data[0].description.length > 60 ? 
                                        `${data[0].description.slice(0, 60)}...` : data[0].description,

                thumbnail: `${data[0].thumbnail.path}.${data[0].thumbnail.extension}`,
                homepage: data[0].urls[0].url,
                wiki: data[0].urls[1].url
            }
        } else {
            return data.map(el => {
                return {
                    name: el.name ? el.name : 'Герой не найден',
                    description: el.description ? el.description : 'К сожалению, описание героя отсутствует',
                    thumbnail: `${el.thumbnail.path}.${el.thumbnail.extension}`,
                    homepage: el.urls[0].url,
                    wiki: el.urls[1].url
                }
            })
        }
        
    }
}