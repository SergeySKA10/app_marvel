import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]),
          [offset, setOffset] = useState(0),
          [newItemLoading, setNewItemsLoading] = useState(false),
          [comicsEnded, setComicsEnded] = useState(false),
          { loading, error, getAllComics, clearError} = useMarvelService();

    useEffect(() => {
        uploadComics(true);
    }, []);

    const uploadComics = (initial) => {
        clearError();

        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllComics(offset)
            .then(onLoadedComics);
    }

    const onLoadedComics = (newComics) => {
        let ended;

        if (newComics.length < 8) ended = true;

        setComics(comics => [...comics, ...newComics]);
        setOffset(offset => offset + 8);
        setNewItemsLoading(false);
        setComicsEnded(ended);
    }

    const createListComics = (data) => {
        return data.map(el => {
            const styleImg = el.thumbnail.includes('not_available') ? {objectFit: 'contain'} : null;
            return (
                <li key={el.id} className="comics__item">
                    <a href={el.url}>
                        <img src={el.thumbnail} alt={`${el.name} url: ${el.thumbnail}`} className="comics__item-img" style={styleImg}/>
                        <div className="comics__item-name">{el.name}</div>
                        <div className="comics__item-price">{el.price}</div>
                    </a>
                </li>
            );
        });
    };

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const styleWrapper = loading && !newItemLoading ? {gridTemplateColumns: 'repeat(1, auto)', 'justify-content': 'space-around'} : null;
    const list = createListComics(comics);
    const styleBtn = comicsEnded ? {display: 'none'} : null;

    return (
        <div className="comics__list">
            <ul className="comics__grid" style={styleWrapper}>
                {errorMessage}
                {spinner}
                {list}
            </ul>
            <button className="button button__main button__long"
                    style={styleBtn}
                    onClick={() => uploadComics(false)}
                    disabled={newItemLoading}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;