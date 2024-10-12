import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useMarvelService from '../../../services/MarvelService';
import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';

import './singleComic.scss';

const SingleComicPage = () => {
    const [comic, setComic] = useState(null),
          {loading, error, getComic, clearError} = useMarvelService(),
          id = useParams();

    useEffect(() => {
        updateComic(id.comicsId);
    }, [id]);

    const updateComic = (id) => {
        clearError();

        getComic(id)
            .then(onLoadedComic);
    }

    const onLoadedComic = (newComic) => {
        setComic(comic => newComic);
    }

    const spinner = loading ? <Spinner/> : null,
          errorMessage = error ? 
            <div style={{textAlign: 'center'}}>
                <ErrorMessage/>
                <p style={{marginBottom: '10px'}}>{`Возможно комикса с id: ${id.comicsId} не существует`}</p>
                <Link to="../.." className="single-comic__back">Вернуться на главную</Link>
            </div>
            : null,
          content = !(loading || error || !comic)  ? <Comic comic={comic}/> : null,
          styleComicWrapper = errorMessage ? {gridTemplateColumns: 'auto'} : null

    return (
        <div className="single-comic" style={styleComicWrapper}>
            {spinner}
            {errorMessage}
            {content}

            {
                !errorMessage ? 
                <Link to=".." className="single-comic__back">Back to comics</Link>
                : null
            }
            
        </div>
    )
}

const Comic = ({comic}) => {
    const {name, description, pageCount, language, price, thumbnail, url} = comic;
    // const stylePichureHero = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null;

    return (
        <>
            <img src={thumbnail} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount} pages</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}$</div>
                <a href={url} style={{marginTop: '15px', color: '#9F0013'}}>Узнать подробнее...</a>
            </div>
        </>
    );
}

export default SingleComicPage;