import { Link } from 'react-router-dom';
import { useList } from '../../hooks/list.hook';
import { setList } from '../../utils/setContent';

import './comicsList.scss';

const ComicsList = () => {
    const {data, offset, setOffset, setPressBtn, newItemsLoading, dataEnded, onClearList, process} = useList('comicsList', 'offsetComicsList', 8);

    const createListComics = (data) => {
        return (
            <ul className='comics__grid'>
                {data.map(el => {
                    const styleImg = el.thumbnail.includes('not_available') ? {objectFit: 'contain'} : null;
                    return (
                        
                            <li key={el.id} className="comics__item">
                                <Link to={`${el.id}`}>
                                    <img src={el.thumbnail} alt={`${el.name} url: ${el.thumbnail}`} className="comics__item-img" style={styleImg}/>
                                    <div className="comics__item-name">{el.name}</div>
                                    <div className="comics__item-price">{el.price}</div>
                                </Link>
                            </li>
                        
                    );
                })}
            </ul>
        );   
    };

    const styleBtn = dataEnded ? {display: 'none'} : null;

    return (
        <div className="comics__list">

            { setList(process, () => createListComics(data), newItemsLoading) }

            <div style={{display: 'flex'}}>
                <button className="button button__main button__long"
                        style={styleBtn}
                        disabled={newItemsLoading}
                        onClick={() => {
                            setOffset(offset => offset + 8);
                            localStorage.setItem('offsetComicsList', +offset + 8);
                            setPressBtn(true);
                        }}>
                    <div className="inner">load more</div>
                </button>
                <button className="button button__main button__long"
                        disabled={newItemsLoading}
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