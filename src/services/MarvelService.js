import { useHttp } from "../hooks/http.hook";

const _api = process.env.REACT_APP_MY_API_KEY; // api ключ

// изменяем MarvelService для его совместной работы с useHttp
const useMarvelService = () => {
    const _apiKey = _api,
    { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // строка постоянного адреса для запросов

    // функция по получению comics героя
    const getComicsChar = async (id) => {
        const res = await request(`${_apiBase}characters/${id}/comics?apikey=${_apiKey}`);
        return res.data.results.map(_transformComicsChar);
    }

    // функция по получению нескольких героев (9шт)
    const getAllCharacters = async (offset = 0) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    // функция по полчению одного героя по id 
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    // функция получения героя по имени

    const getCharacterName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    // функция по получению комикса
    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&apikey=${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?apikey=${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    // функция - трансформатор данных - получение комиксов героя
    const _transformComicsChar = (data) => {
        return {
            name: data.title,
            url: data.urls[0].url
        }
    }

    // функция - трансформатор данных - получение данных о герое 
    const _transformCharacter = (data) => {
        return {
            id: data.id,
            name: data.name ? data.name : 'Герой не найден',

            description: !data.description ? 
                            'К сожалению, описание героя отсутствует' 
                            : data.description,

            thumbnail: `${data.thumbnail.path}.${data.thumbnail.extension}`,
            homepage: data.urls[0].url,
            wiki: data.urls[1].url
        }
    }

    // функция - трансформатор данных, получение данных о комиксе
    const _transformComics = (data) => {
        return {
            id: data.id,
            name: data.title,
            description: !data.description || data.description === '#N/A' ? "К сожалению, описание комикса отсутствует" : 
                          data.description.length > 300 ? `${data.description.slice(0, 300)}...` : data.description,
            pageCount: data.pageCount,
            language: data.textObjects.length === 0 ? '' : data.textObjects[0].language ? data.textObjects[0].language : 'not specified',
            thumbnail: `${data.thumbnail.path}.${data.thumbnail.extension}`,
            url: data.urls[0].url,
            price: data.prices[0].price ? data.prices[0].price : 'NOT AVAILABLE'
        }
    }
    
    return {
        loading,
        error,
        getAllCharacters,
        getCharacter,
        getCharacterName,
        getComicsChar,
        clearError,
        getAllComics,
        getComic
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