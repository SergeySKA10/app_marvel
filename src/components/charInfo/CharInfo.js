//import { Component } from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {
    const [data, setData] = useState(null),
          {clearError, getCharacter, getComicsChar, process, setProcess} = useMarvelService();

    useEffect(() => {
        uploadCharInfo();
    }, [props.charId]);

    // функция обновления char, comics and loading после получения данных с сервера
    const onCharLoaded = (newChar) => {
        getComicsChar(props.charId)
            .then(newComics => {
                setData(data => ({...newChar, comics: [...newComics.slice(0, 10)]}));
            })
            .then(() => setProcess('confirmed'));
    }

    // функция по получению описания героя из списка
    const uploadCharInfo = () => {
        if (!props.charId) {
            return
        }

        clearError();

        getCharacter(props.charId)
            .then(onCharLoaded);     
    }
    
    return (
        <div className="char__info">
            {setContent(process, data, ContentView, true)}
        </div>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

const ContentView = (props) => {
    console.log(props);
    const {name, description, thumbnail, homepage, wiki, comics} = props.data;

    const comicsList = comics.length === 0 ? 
                            'К сожалению комиксы с данным героем отсутствуют':
                            comics.map((el, i) => {
                                return (
                                    <li className="char__comics-item" key={i}>
                                        <a href={el.url}>{el.name}</a>
                                    </li>
                                );
                            });

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}/>
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
                {description.length > 60 ? `${description.slice(0, 60)}...` : description}
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

export default CharInfo;


// export default class CharInfo extends Component {
//     state = {
//         char: null,
//         comics: null,
//         loading: false,
//         error: false
//     }

//     // переменная по созданию запросов
//     marvelService = new MarvelService();

//     componentDidMount() {
//         this.uploadCharInfo();
//     }

//     componentDidUpdate(prevProps) {
//         if (this.props.charId !== prevProps.charId) {
//             this.uploadCharInfo();
//         }
//     }

//     // функция обновления char, comics and loading после получения данных с сервера
//     onCharLoaded = (char) => {
//         this.marvelService
//             .getComics(this.props.charId)
//             .then(comics => {
//                 this.setState({
//                     char,
//                     comics: comics.slice(0, 10), 
//                     loading: false
//                 });
//             })
//             .catch(this.onError);
         
//     }

//     // функция обновления state.error при ошибке запроса
//     onError = () => {
//         this.setState({
//             loading: false,
//             error: true
//         });
//     }

//     // функция по показу спинера между загрузками
//     onCharLoading = () => {
//         this.setState({
//             loading: true
//         });
//     }

//     // функция по получению описания героя из списка
//     uploadCharInfo = () => {
//         if (!this.props.charId) {
//             return
//         }
        
//         this.onCharLoading();

//         this.marvelService
//             .getCharacter(this.props.charId)
//             .then(this.onCharLoaded)
//             .catch(this.onError);      
//     }


//     render() {
//         const {char, comics, loading, error} = this.state,
        
//               // условия отображаемого контента
//               skeleton = loading || error || char || comics ? null :  <Skeleton/>,
//               spinner = loading ? <Spinner/> : null,
//               errorMessage = error ? <ErrorMessage/> : null,
//               content = !(loading || error || !char || !comics ) ? <ContentView char={char} comics={comics}/> : null;

        
//         return (
//             <div className="char__info">
//                 {skeleton}
//                 {spinner}
//                 {errorMessage}
//                 {content}
//             </div>
//         );
//     }
// }