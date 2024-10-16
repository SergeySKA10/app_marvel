//import { Component } from 'react';
import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = (props) => {
    const [char, setChar] = useState(null),
          [timer, setTimer] = useState(false),
          { loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        //первичное получение данных для отображения рандомного героя
        getRandomChar();
    }, []);

    // запуск таймера для обновления
    useEffect(() => {
        let timerId;
        // условия запуска или отчиски таймера
        if (timer) {
            clearInterval(timerId); 
            console.log('clear timer')
        } else {
            timerId = setInterval(getRandomChar, 60000);
            console.log('timer start')
        }

        return () => clearInterval(timerId);
    }, [timer]);

    function getRandomChar() {
        clearError();
        // формирование рандомного id (цифры из бд Marvel)
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        getCharacter(id)
            .then(onCharLoaded);
    };

    // функция обновления state.char после получения данных с сервера
    const onCharLoaded = (data) => {
        setChar(char => data);
    };

    //функция обновления интервала отображения рандомного героя (запуск или удаление timerID)
    const uploadInterval = () => {
        if (timer) {
            setTimer(false);
        } else {
            setTimer(true);
        }
    };

    const spinner = loading ? <Loading/> : null,
          errorMessage = error ?
            <div style={{textAlign: 'center', marginTop: '30px'}}>
                <ErrorMessage/>
            </div>
            : null,
          content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="randomchar"
                onMouseEnter={uploadInterval}
                onMouseLeave={uploadInterval}
                >

            {spinner}
            {errorMessage}
            {content}

            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={getRandomChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    );
}

// компонент загрузочного экрана (спиннер)
const Loading = () => {
    return (
        <div className="randomchar__block">
            <Spinner/>
            <p style={{color: '#9F0013', textAlign: 'center', alignContent: 'center'}}>Загрузка информации о Герое</p>
        </div>
    )
}

// компонент отображаемого контента в случае успешного получения данных с сервера
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description.length > 60 ? `${description.slice(0, 60)}...` : description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RandomChar;


// export default class RandomChar extends Component {
//     state = {
//         char: {},
//         loading: true,
//         error: false
//     };

//     componentDidMount() {
//         // первичное получение данных для отображения рандомного героя
//         this.getRandomChar();
//         // обновление данных для отображения рандомного героя через каждые 60 сек.
//         this.timerID = setInterval(this.getRandomChar, 60000)
//     }

//     componentWillUnmount() {
//         // удаление интервала
//         clearInterval(this.timerID);
//     }

//     // функция обновления интервала отображения рандомного героя (запуск или удаление this.timerID)
//     uploadInterval = () => {
//         if (this.timerID) {
//             clearInterval(this.timerID);
//             this.timerID = 0;
//         } else {
//             this.timerID = setInterval(this.getRandomChar, 60000)
//         }
//     }

//     // функция обновления state.char and loading после получения данных с сервера
//     onCharLoaded = (char) => {
//         this.setState({
//             char, 
//             loading: false
//         });
//     }

//     // функция обновления state.error
//     onError = () => {
//         this.setState({
//             loading: false,
//             error: true
//         })
//     }

//     //функция по показу спинера между загрузками
//     onCharLoading = () => {
//         this.setState({
//             loading: true
//         });
//     }

//     // функция по получению нового героя
//     getRandomChar = () => {
//         // формирование рандомного id (цифры из бд Marvel)
//         const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000),
//               marvelService = new MarvelService();

//         this.onCharLoading(); // реализация спинера между загрузками контента

//         marvelService.getCharacter(id)
//                    .then(this.onCharLoaded)
//                    .catch(this.onError);
//     }

//     render() {
//         const {char, loading, error} = this.state,
//               // условия отображаемого контента
//               spinner = loading ? <Loading/> : null,
//               errorMessage = error ? <ErrorMessage/> : null,
//               content = !(loading || error) ? <View char={char}/> : null;

//         return (
//             <div className="randomchar"
//                  onMouseEnter={this.uploadInterval}
//                  onMouseLeave={this.uploadInterval}>
//                 {spinner}
//                 {errorMessage}
//                 {content}
//                 <div className="randomchar__static">
//                     <p className="randomchar__title">
//                         Random character for today!<br/>
//                         Do you want to get to know him better?
//                     </p>
//                     <p className="randomchar__title">
//                         Or choose another one
//                     </p>
//                     <button className="button button__main" onClick={this.getRandomChar}>
//                         <div className="inner">try it</div>
//                     </button>
//                     <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
//                 </div>
//             </div>
//         );  
//     }
// }
