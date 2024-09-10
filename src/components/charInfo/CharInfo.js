import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

export default class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    // переменная по созданию запросов
    marvelService = new MarvelService();

    componentDidMount() {
        this.uploadCharInfo();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.uploadCharInfo();
        }
    }

    // функция обновления state.char and loading после получения данных с сервера
    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        });
    }

    // функция обновления state.error при ошибке запроса
    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    // функция по показу спинера между загрузками
    onCharLoading = () => {
        this.setState({
            loading: true
        });
    }

    // функция по получению описания героя из списка
    uploadCharInfo = () => {
        if (!this.props.charId) {
            return
        }
        
        this.onCharLoading();

        this.marvelService
            .getCharacter(this.props.charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }


    render() {
        const {char, loading, error} = this.state,
              // условия отображаемого контента
              skeleton = loading || error || char ? null :  <Skeleton/>,
              spinner = loading ? <Spinner/> : null,
              errorMessage = error ? <ErrorMessage/> : null,
              content = !(loading || error || !char) ? <ContentView char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        );
    }
}

const ContentView = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char,
          stylePichureHero = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null;

    const comicsList = comics.length === 0 ? 'К сожалению комиксы с данным героем отсутствуют':
    comics.map((el, i) => {
        return (
            <li className="char__comics-item" key={i}>
                <a href={el.resourceURI}>{el.name}</a>
            </li>
        );
    });

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={stylePichureHero}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsList}
            </ul>
        </>
    );
}