import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

export default class CharInfo extends Component {
    state = {
        char: null,
        comics: null,
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

    // функция обновления char, comics and loading после получения данных с сервера
    onCharLoaded = (char) => {
        this.marvelService
            .getComics(this.props.charId)
            .then(comics => {
                this.setState({
                    char,
                    comics: comics.slice(0, 10), 
                    loading: false
                });
            })
            .catch(this.onError);
         
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
        const {char, comics, loading, error} = this.state,
        
              // условия отображаемого контента
              skeleton = loading || error || char || comics ? null :  <Skeleton/>,
              spinner = loading ? <Spinner/> : null,
              errorMessage = error ? <ErrorMessage/> : null,
              content = !(loading || error || !char || !comics ) ? <ContentView char={char} comics={comics}/> : null;

        
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

CharInfo.propTypes = {
    charId: PropTypes.number
}

const ContentView = (props) => {
    const {name, description, thumbnail, homepage, wiki} = props.char,
          stylePichureHero = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null;

    const comicsList = props.comics.length === 0 ? 
                            'К сожалению комиксы с данным героем отсутствуют':
                            props.comics.map((el, i) => {
                                return (
                                    <li className="char__comics-item" key={i}>
                                        <a href={el.url}>{el.name}</a>
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

ContentView.propTypes = {
    comics: PropTypes.array
}