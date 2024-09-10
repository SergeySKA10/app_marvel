import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

export default class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        offset: 0
    }

    componentDidMount() {
        // изначальная загрузка героев
        this.uploadCharList();
    }

    // функция изменения состония chars and loading
    onLoadedChars = (chars) => {
        const data = [...this.state.chars, ...chars]
        this.setState({
            chars: data,
            loading: false,
            offset: this.state.offset + 9
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

        marvelService.getAllCharacters()
                     .then(this.onLoadedChars)
                     .catch(this.error);
    }

    // функция формирования списка
    _createCharList = (data) => {
        return data.map(el => {
            const stylePichureHero = el.thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null;

            return (
                <li className="char__item" key={el.id} onClick={() => this.props.onCharSelected(el.id)}>
                    <img src={el.thumbnail} alt={el.description} style={stylePichureHero}/>
                    <div className="char__name">{el.name}</div>
                </li>
            );
        });
    }

    render() {
        const {chars, loading, error} = this.state,
              list = this._createCharList(chars),
              // условия отображаемого контента
              styleWrapper = loading || error ? {gridTemplateColumns: 'repeat(1, 650px)'} : null,
              spinner = loading ? <Spinner/> : null,
              errorMessage = error ? <ErrorMessage/> : null,
              contentList = !(loading || error) ? <ViewList list={list}/>: null;

        return (
            <div className="char__list">
                <ul className="char__grid" style={styleWrapper}>
                    {spinner}
                    {errorMessage}
                    {contentList}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner" onClick={this.uploadCharList}>load more</div>
                </button>
            </div>
        )
    }
}

// компонент отображаемого контента в случае успешного получения данных с сервера

const ViewList = ({list}) => {
    return (
        <ul className="char__grid">
            {list}
        </ul>
    );
}
