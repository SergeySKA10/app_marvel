import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

export default class CharList extends Component {
    charsRef = [];
    state = {
        chars: [],
        loading: true,
        error: false,
        offset: 0,
        newItemsLoading: false,
        charEnded: false
    }

    componentDidMount() {
        // изначальная загрузка героев
        this.uploadCharList();
    }

    // функция изменения состония chars and loading
    onLoadedChars = (chars) => {
        let ended = false;

        if (chars.length < 9) {
            ended = true;
        }

        const data = [...this.state.chars, ...chars]
        this.setState(({offset}) => ({
            chars: data,
            loading: false,
            offset: offset + 9,
            newItemsLoading: false,
            charEnded: ended
        }));
    }

    // функция по изменению состояния newItemsLoading при загрузке
    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        });
    }

    // функция изменения состония при ошибке
    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    // функция обновления списка героев
    uploadCharList = () => {
        const marvelService = new MarvelService(this.state.offset);

        this.onCharListLoading();

        marvelService.getAllCharacters()
                     .then(this.onLoadedChars)
                     .catch(this.onError);
    }

    setItemRef = (elem) => {
        this.charsRef.push(elem);
    }

    onFocus = (i) => {
        this.charsRef[i].focus();
        this.charsRef.forEach(el => el.classList.remove('char__item_selected'));
        this.charsRef[i].classList.add('char__item_selected'); 
    }

    // функция формирования списка
    _createCharList = (data) => {
        return data.map((el, i) => {
            const stylePichureHero = el.thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null;

            return (
                <li ref={this.setItemRef} 
                    className="char__item" 
                    key={el.id} 
                    tabIndex={0} 
                    onClick={() => {
                        this.props.onCharSelected(el.id); 
                        this.onFocus(i)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(el.id); 
                            this.onFocus(i)
                        }
                    }}>

                    <img src={el.thumbnail} alt={el.description} style={stylePichureHero}/>
                    <div className="char__name">{el.name}</div>

                </li>
            );
        });
    }


    render() {
        const {chars, loading, error, newItemsLoading, charEnded} = this.state,
              list = this._createCharList(chars),
              
              // условия отображаемого контента
              styleWrapper = loading || error ? {gridTemplateColumns: 'repeat(1, 650px)'} : null,
              spinner = loading ? <Spinner/> : null,
              errorMessage = error ? <ErrorMessage/> : null,
              contentList = !(loading || error) ? list: null;

        return (
            <div className="char__list">
                <ul className="char__grid" style={styleWrapper}>
                    {spinner}
                    {errorMessage}
                    {contentList}
                </ul>
                <button className="button button__main button__long"
                        disabled={newItemsLoading}
                        style={{'display': charEnded ? 'none' : null}}>
                    <div className="inner" onClick={this.uploadCharList}>load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}


