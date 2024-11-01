import { useState, useEffect } from 'react';

import useMarvelService from '../services/MarvelService';

// custom hook для формирования state в компоненты charList && comicsList

export const useList = (dataName, offsetName, step) => {
    const [data, setData] = useState(localStorage.getItem(dataName) ? JSON.parse(localStorage.getItem(dataName)) : []),
          [pressBtn, setPressBtn] = useState(false), // стейт для определения нажатия кнопки обновления списка
          [offset, setOffset] = useState(localStorage.getItem(offsetName) ? +localStorage.getItem(offsetName) : 0),
          [newItemsLoading, setNewItemsLoading] = useState(false), // стейт для установки disabled на триггеры
          [dataEnded, setDataEnded] = useState(false), // стейт для установки конца списка 
          {getAllCharacters, getAllComics, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        if (!localStorage.getItem(dataName)) {
            uploadData(true);
        } else if (pressBtn) {
            uploadData(false);
            setPressBtn(false);
        }
    }, [offset]);


    // функция обновления героев 
    const uploadData = (initial) => {
        clearError();
        
        //условие для корректного включения Spinner при первичной загрузке героев
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        switch (dataName) {
            case 'charsList':
                console.log('1')
                getAllCharacters(offset)
                    .then(onLoadedNewData)
                    .then(() => setProcess('confirmed'));
                    break;
            case 'comicsList': 
                console.log('2')
                getAllComics(offset)
                    .then(onLoadedNewData)
                    .then(() => {
                        setProcess('confirmed');
                    });
                    break;
            default: throw new Error('DataName not found in hook')
        }
        
        
    }

    // функция изменения состония data, ended newItemsLoading
    const onLoadedNewData = (newData) => {
        let ended = false;

        if (newData.length < step) {
            ended = true;
        } 

        setData(data => [...data, ...newData]);
        localStorage.setItem(dataName, JSON.stringify([...data, ...newData]));
        setDataEnded(ended);
        setNewItemsLoading(false);
    }

    useEffect(() => {
        if (data.length === 0) {
            onClearList();
        }
    }, [data])

    // отчиска localStorage и возвращение на изначальные состояния
    const onClearList = () => {
        localStorage.removeItem(dataName);
        localStorage.removeItem(offsetName);
        if (offset === 0) {
            uploadData(true);
        }
    }

    return {
        data,
        setData,
        offset,
        setOffset,
        setPressBtn,
        newItemsLoading,
        dataEnded,
        onClearList,
        process
    }
}