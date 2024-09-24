import { useHttp } from "../hooks/http.hook";

const _api = process.env.REACT_APP_MY_API_KEY; // api ключ

// изменяем MarvelService для его совместной работы с useHttp
const useMarvelService = () => {
    const _apiKey = _api,
    { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // строка постоянного адреса для запросов

    // функция по получению comics
    const getComics = async (id) => {
        const res = await request(`${_apiBase}characters/${id}/comics?apikey=${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    // функция по получению нескольких героев (9шт)
    const getAllCharacters = async (offset = 0) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    // функция по полчению одного героя
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    // функция - трансформатор данных - выборка нужных данных для последующей работы
    const _transformComics = (data) => {
        return {
            name: data.title,
            url: data.urls[0].url
        }
    }

    // функция - трансформатор данных - выборка нужных данных для последующей работы 
    const _transformCharacter = (data) => {
        return {
            id: data.id,
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
    
    return {
        loading,
        error,
        getAllCharacters,
        getCharacter,
        getComics,
        clearError
    }
}

export default useMarvelService;



// класс MarvelService - по запросу данных на сервер и обработки данных

// export default class MarvelService {
//     constructor(offset) {
//         this._apiKey = _api;
//         this.offset = offset; // число для формирования отступа в БД Marvel по запосам (исключение повторений героев)
//     }
//     _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // строка постоянного адреса для запросов

//     // characters/1017100/comics?apikey=

//     // функция по полчению данных
//     getResource = async (url) => {
//         let result = await fetch(url);

//         if (!result.ok) {
//             throw new Error (`Could not fetch ${url}, status: ${result.status}`);
//         }

//         return await result.json();
//     }

//     // функция по получению comics
//     getComics = async (id) => {
//         const res = await this.getResource(`${this._apiBase}characters/${id}/comics?apikey=${this._apiKey}`);
//         return res.data.results.map(this._transformComics);
//     }

//     // функция по получению нескольких героев (9шт)
//     getAllCharacters = async () => {
//         const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${this.offset}&apikey=${this._apiKey}`);
//         return res.data.results.map(this._transformCharacter);
//     }

//     // функция по полчению одного героя
//     getCharacter = async (id) => {
//         const res = await this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);
//         return this._transformCharacter(res.data.results[0]);
//     }

//     // функция - трансформатор данных - выборка нужных данных для последующей работы
//     _transformComics = (data) => {
//         return {
//             name: data.title,
//             url: data.urls[0].url
//         }
//     }

//     // функция - трансформатор данных - выборка нужных данных для последующей работы 
//     _transformCharacter = (data) => {
//         return {
//             id: data.id,
//             name: data.name ? data.name : 'Герой не найден',

//             description: !data.description ? 
//                             'К сожалению, описание героя отсутствует': 
//                             data.description.length > 60 ? 
//                                     `${data.description.slice(0, 60)}...` : data.description,

//             thumbnail: `${data.thumbnail.path}.${data.thumbnail.extension}`,
//             homepage: data.urls[0].url,
//             wiki: data.urls[1].url
//         }
//     }
// }