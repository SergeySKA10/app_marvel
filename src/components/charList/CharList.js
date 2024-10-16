//import { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


const CharList = (props) => {
    const [chars, setChars] = useState(localStorage.getItem('charsList') ? JSON.parse(localStorage.getItem('charsList')) : []),
          [offset, setOffset] = useState(localStorage.getItem('offsetCharsList') ? +localStorage.getItem('offsetCharsList') : 0),
          [newItemsLoading, setNewItemsLoading] = useState(false), // стейт для установки disabled на триггеры
          [charEnded, setCharEnded] = useState(false), // стейт для установки конца списка героев
          {loading, error, getAllCharacters, clearError} = useMarvelService(),
          [inProp, setInProp] = useState(false); // стейт для анимации
        //   [pressBtn, setPressBtn] = useState(false); // стейт для кнопки отчиски списка

    useEffect(() => {
        
        console.log(myRef.current)

        if (!localStorage.getItem('charsList')) {
            console.log('yes')
            uploadCharList(true);
        } else {
            // console.log(offset, 'offset');
            // console.log(localStorage.getItem('offsetCharsList'));
            uploadCharList(false);
        }

    }, [offset]);
    

    // функция обновления списка героев
    const uploadCharList = (initial) => {
        clearError();
        
        //условие для корректного включения Spinner при первичной загрузке героев
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllCharacters(offset)
            .then(onLoadedChars);
    }

    
    // функция изменения состония chars, newItemLoading, ended
    const onLoadedChars = (newChars) => {
        let ended = false;

        if (newChars.length < 9) {
            ended = true;
        } 

        setChars(chars => [...chars, ...newChars]);
        localStorage.setItem('charsList', JSON.stringify([...chars, ...newChars]));
        setCharEnded(ended);
        setNewItemsLoading(newItemsLoading => false);
        localStorage.setItem('offsetCharsList', +offset + 9);
    }

    // создание ref 
    const myRef = useRef([]);

    // функция фокуса и добавления класса активности выбранному элементу
    const onFocus = (i) => {
        myRef.current[i].focus();
        myRef.current.forEach(el => el.classList.remove('char__item_selected'));
        myRef.current[i].classList.add('char__item_selected'); 
    }

    // функция формирования списка
    const _createCharList = (data) => {
        // return data.map((el, i) => {
            // const stylePichureHero = el.thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null;

            return (
                <TransitionGroup className='char__grid' component='ul'>
                    {data.map((el, i) => (
                        <CSSTransition in={inProp} timeout={500} classNames='list-chars'>
                            <li 
                                ref={el => myRef.current[i] = el} // с помощью "callback Ref" происходит добавление элементов в массив myRef
                                className="char__item" 
                                key={el.id} 
                                tabIndex={0} 
                                onClick={() => {
                                    props.onCharSelected(el.id); 
                                    onFocus(i)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === ' ' || e.key === "Enter") {
                                        props.onCharSelected(el.id); 
                                        onFocus(i)
                                    }
                                }}>

                                <img src={el.thumbnail} alt={el.description} style={el.thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null}/>
                                <div className="char__name">{el.name}</div>

                            </li>
                        </CSSTransition>
                    ))}
                </TransitionGroup>


            );
        // });
    }

    // отчиска localStorage и возвращение на изначальные состояния
    const onClearList = () => {
        if (offset === 0) {
            uploadCharList(true);
        }
        localStorage.removeItem('charsList');
        localStorage.removeItem('offsetCharsList');
        setChars(chars => []);
        setOffset(0);
        myRef.current.length = 0;
    }

    // отображение контента
    const spinner = loading && !newItemsLoading ? <Spinner/> : null;
    const errorMessage = error ? 
        <div style={{textAlign: 'center'}}>
            <ErrorMessage/>
        </div>
        : null;
    const items = _createCharList(chars);

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
            <div style={{display: 'flex'}}>
                <button className="button button__main button__long"
                        disabled={newItemsLoading}
                        style={{'display': charEnded ? 'none' : null}}
                        onClick={() => {
                            setOffset(offset => offset + 9);
                            setInProp(true);
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

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;



// export default class CharList extends Component {
//     charsRef = [];
//     state = {
//         chars: [],
//         loading: true,
//         error: false,
//         offset: 0,
//         newItemsLoading: false,
//         charEnded: false
//     }

//     componentDidMount() {
//         // изначальная загрузка героев
//         this.uploadCharList();
//     }

//     // функция изменения состония chars and loading
//     onLoadedChars = (chars) => {
//         let ended = false;

//         if (chars.length < 9) {
//             ended = true;
//         }

//         const data = [...this.state.chars, ...chars]
//         this.setState(({offset}) => ({
//             chars: data,
//             loading: false,
//             offset: offset + 9,
//             newItemsLoading: false,
//             charEnded: ended
//         }));
//     }

//     // функция по изменению состояния newItemsLoading при загрузке
//     onCharListLoading = () => {
//         this.setState({
//             newItemsLoading: true
//         });
//     }

//     // функция изменения состония при ошибке
//     onError = () => {
//         this.setState({
//             loading: false,
//             error: true
//         });
//     }

//     // функция обновления списка героев
//     uploadCharList = () => {
//         const marvelService = new MarvelService(this.state.offset);

//         this.onCharListLoading();

//         marvelService.getAllCharacters()
//                      .then(this.onLoadedChars)
//                      .catch(this.onError);
//     }

//      // callback ref добавляем ссылки на элементы в массив
//     setItemRef = (elem) => {
//         this.charsRef.push(elem);
//     }
//      // создаем фокус на выбранном элементе по индексу и добавляем ему класс активности 
//     onFocus = (i) => {
//         this.charsRef[i].focus();
//         this.charsRef.forEach(el => el.classList.remove('char__item_selected'));
//         this.charsRef[i].classList.add('char__item_selected'); 
//     }

//     // функция формирования списка
//     _createCharList = (data) => {
//         return data.map((el, i) => {
//             const stylePichureHero = el.thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null;

//             return (
//                 <li ref={this.setItemRef} 
//                     className="char__item" 
//                     key={el.id} 
//                     tabIndex={0} 
//                     onClick={() => {
//                         this.props.onCharSelected(el.id); 
//                         this.onFocus(i)
//                     }}
//                     onKeyDown={(e) => {
//                         if (e.key === ' ' || e.key === "Enter") {
//                             this.props.onCharSelected(el.id); 
//                             this.onFocus(i)
//                         }
//                     }}>

//                     <img src={el.thumbnail} alt={el.description} style={stylePichureHero}/>
//                     <div className="char__name">{el.name}</div>

//                 </li>
//             );
//         });
//     }


//     render() {
//         const {chars, loading, error, newItemsLoading, charEnded} = this.state,
//               list = this._createCharList(chars),
              
//               // условия отображаемого контента
//               styleWrapper = loading || error ? {gridTemplateColumns: 'repeat(1, 650px)'} : null,
//               spinner = loading ? <Spinner/> : null,
//               errorMessage = error ? <ErrorMessage/> : null,
//               contentList = !(loading || error) ? list: null;

//         return (
//             <div className="char__list">
//                 <ul className="char__grid" style={styleWrapper}>
//                     {spinner}
//                     {errorMessage}
//                     {contentList}
//                 </ul>
//                 <button className="button button__main button__long"
//                         disabled={newItemsLoading}
//                         style={{'display': charEnded ? 'none' : null}}>
//                     <div className="inner" onClick={this.uploadCharList}>load more</div>
//                 </button>
//             </div>
//         )
//     }
// }




