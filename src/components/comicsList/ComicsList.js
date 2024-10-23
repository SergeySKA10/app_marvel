import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import { setList } from '../../utils/setContent';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState(localStorage.getItem('comicsList') ? JSON.parse(localStorage.getItem('comicsList')) : []),
          [offset, setOffset] = useState(localStorage.getItem('offsetComicsList') ? +localStorage.getItem('offsetComicsList') : 0),
          [newItemLoading, setNewItemsLoading] = useState(false),
          [comicsEnded, setComicsEnded] = useState(false),
          {getAllComics, clearError, process, setProcess} = useMarvelService(),
          [inProp, setInProp] = useState(false), // стейт для анимации
          [pressBtn, setPressBtn] = useState(false); // стейт для определения нажатия кнопуи обновления списка

    useEffect(() => {
        if (!localStorage.getItem('comicsList')) {
            uploadComics(true);
        } else if (pressBtn) {
            uploadComics(false);
            setPressBtn(false);
        } 
    }, [offset]);

    const uploadComics = (initial) => {
        clearError();

        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllComics(offset)
            .then(onLoadedComics)
            .then(() => setProcess('confirmed'));
    }

    const onLoadedComics = (newComics) => {
        let ended;

        if (newComics.length < 8) ended = true;

        setComics(comics => [...comics, ...newComics]);
        localStorage.setItem('comicsList', JSON.stringify([...comics, ...newComics]));
        setNewItemsLoading(false);
        setComicsEnded(ended);
        localStorage.setItem('offsetComicsList', +offset + 8);
    }

    const createListComics = (data) => {
        return (
            <TransitionGroup className='comics__grid' component='ul'>
                {data.map(el => {
                    const styleImg = el.thumbnail.includes('not_available') ? {objectFit: 'contain'} : null;
                    return (
                        <CSSTransition  in={inProp} timeout={1000} classNames='list-comics'>
                            <li key={el.id} className="comics__item">
                                <Link to={`${el.id}`}>
                                    <img src={el.thumbnail} alt={`${el.name} url: ${el.thumbnail}`} className="comics__item-img" style={styleImg}/>
                                    <div className="comics__item-name">{el.name}</div>
                                    <div className="comics__item-price">{el.price}</div>
                                </Link>
                            </li>
                        </CSSTransition> 
                    );
                })}
            </TransitionGroup>
        );   
    };

       // отчиска localStorage и возвращение на изначальные состояния
       const onClearList = () => {
        if (offset === 0) {
            uploadComics(true);
        }
        localStorage.removeItem('comicsList');
        localStorage.removeItem('offsetComicsList');
        setComics(comics => []);
        setOffset(0);
    }

    const styleBtn = comicsEnded ? {display: 'none'} : null;

    return (
        <div className="comics__list">

            { setList(process, () => createListComics(comics), newItemLoading) }

            <div style={{display: 'flex'}}>
                <button className="button button__main button__long"
                        style={styleBtn}
                        disabled={newItemLoading}
                        onClick={() => {
                            setOffset(offset => offset + 8);
                            setPressBtn(true);
                            setInProp(true);
                        }}>
                    <div className="inner">load more</div>
                </button>
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        onClick={() => onClearList()}>
                    <div className="inner">
                            Clear list
                    </div>
                </button>
            </div>
            
        </div>
    )
}

export default ComicsList;