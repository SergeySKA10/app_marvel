import { useState, useEffect } from 'react';

import useMarvelService from '../services/MarvelService';

// custom hook для формирования state в компоненты charList && comicsList

export const useList = () => {
    const [chars, setChars] = useState(localStorage.getItem('charsList') ? JSON.parse(localStorage.getItem('charsList')) : []),
          [comics, setComics] = useState(localStorage.getItem('comicsList') ? JSON.parse(localStorage.getItem('comicsList')) : []),
          [pressBtnChars, setPressBtnChars] = useState(false), // стейт для определения нажатия кнопки обновления списка
          [pressBtnComics, setPressBtnComics] = useState(false), // стейт для определения нажатия кнопки обновления списка
          [offsetChars, setOffsetChars] = useState(localStorage.getItem('offsetChars') ? +localStorage.getItem('offsetChars') : 0),
          [offsetComics, setOffsetComics] = useState(localStorage.getItem('offsetComics') ? +localStorage.getItem('offsetComics') : 0),
          [newItemsLoading, setNewItemsLoading] = useState(false), // стейт для установки disabled на триггеры
          [dataEnded, setDataEnded] = useState({chars: false, comics: false}), // стейт для установки конца списка 
          {getAllCharacters, getAllComics, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        if (!localStorage.getItem('charsList')) {
            uploadCharList(true);
            (console.log('1ch'))
        } else if (pressBtnChars) {
            (console.log('2ch'))
            uploadCharList(false);
            setPressBtnChars(false);
        }
    }, [offsetChars]);

    useEffect(() => {
        if (!localStorage.getItem('comicsList')) {
            uploadComicsList(true);
            (console.log('1co'))
        } else if (pressBtnComics) {
            (console.log('2co'))
            uploadComicsList(false);
            setPressBtnComics(false);
        }
    }, [offsetComics]);


    // функция обновления героев 
    const uploadCharList = (initial) => {
        clearError();
        
        //условие для корректного включения Spinner при первичной загрузке героев
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllCharacters(offsetChars)
            .then(onLoadedChars)
            .then(() => setProcess('confirmed'));
        
    }

    // функция обновления комиксов 
    const uploadComicsList = (initial) => {
        clearError();
        
        //условие для корректного включения Spinner при первичной загрузке героев
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        getAllComics(offsetComics)
            .then(onLoadedComics)
            .then(() => setProcess('confirmed'));
    }
    


    // функция изменения состония chars, newItemLoading, ended.chars
    const onLoadedChars = (newData) => {
        let ended = false;

        if (newData.length < 9) {
            ended = true;
        } 

        setChars(chars => [...chars, ...newData]);
        localStorage.setItem('charsList', JSON.stringify([...chars, ...newData]));
        setDataEnded(dataEnded => ({...dataEnded, chars: ended}));
        setNewItemsLoading(newItemsLoading => false);
        localStorage.setItem('offsetChars', offsetChars);
    }

    // функция изменения состония comics, newItemLoading, ended.comics
    const onLoadedComics = (newData) => {
        let ended = false;

        if (newData.length < 8) {
            ended = true;
        } 

        setComics(comics => [...comics, ...newData]);
        localStorage.setItem('comicsList', JSON.stringify([...comics, ...newData]));
        setDataEnded(dataEnded => ({...dataEnded, comics: ended}));
        setNewItemsLoading(newItemsLoading => false);
        localStorage.setItem('offsetComics', offsetComics);
    }

    // отчиска localStorage и возвращение на изначальные состояния
    const onClearList = (initial) => {
        switch (initial) {
            case 'chars': 
                if (offsetChars === 0) {
                    console.log(offsetChars, 'ch this')
                    uploadCharList(true);
                }
                localStorage.removeItem('charsList');
                localStorage.removeItem('offsetChars');
                setChars([]);
                setOffsetChars(0);
                break;
            case 'comics':
                if (offsetComics === 0) {
            
                    console.log(offsetComics, 'co this')
                    uploadComicsList(true);
                }
                localStorage.removeItem('comicsList');
                localStorage.removeItem('offsetComics');
                setComics([]);
                setOffsetComics(0);
                break;
            default: throw new Error('initial list in "onClearList function" not found')
        }
        
    }

    return {
        chars,
        comics,
        setOffsetChars,
        setOffsetComics,
        setPressBtnChars,
        setPressBtnComics,
        newItemsLoading,
        dataEnded,
        onClearList,
        process
    }
}