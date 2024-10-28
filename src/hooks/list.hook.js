import { useState, useEffect } from 'react';

import useMarvelService from '../services/MarvelService';

// custom hook для формирования state в компоненты charList && comicsList

export const useList = (storageDataName, storageOffsetName, step) => {
    const [data, setData] = useState(localStorage.getItem(storageDataName) ? JSON.parse(localStorage.getItem(storageDataName)) : []),
          [pressBtn, setPressBtn] = useState(false), // стейт для определения нажатия кнопуи обновления списка
          [offset, setOffset] = useState(localStorage.getItem(storageOffsetName) ? +localStorage.getItem(storageOffsetName) : 0),
          [newItemsLoading, setNewItemsLoading] = useState(false), // стейт для установки disabled на триггеры
          [dataEnded, setDataEnded] = useState(false), // стейт для установки конца списка 
          {getAllCharacters, getAllComics, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        if (!localStorage.getItem(storageDataName)) {
            uploadCharList(true);
        } else if (pressBtn) {
            uploadCharList(false);
            setPressBtn(false);
        }
    }, [offset]);


    // функция обновления списка 
    const uploadCharList = (initial) => {
        clearError();
        
        //условие для корректного включения Spinner при первичной загрузке героев
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);

        switch(storageDataName) {
            case 'charsList':
                getAllCharacters(offset)
                    .then(onLoadedData)
                    .then(() => setProcess('confirmed'));
                    break;
            case 'comicsList':
                getAllComics(offset)
                    .then(onLoadedData)
                    .then(() => setProcess('confirmed'));
                    break;
            default:
                throw new Error('argument "storageDataName" not found');
        }
        
    }


    // функция изменения состония data, newItemLoading, ended
    const onLoadedData = (newData) => {
        let ended = false;

        if (newData.length < step) {
            ended = true;
        } 

        setData(data => [...data, ...newData]);
        localStorage.setItem(storageDataName, JSON.stringify([...data, ...newData]));
        setDataEnded(ended);
        setNewItemsLoading(newItemsLoading => false);
        localStorage.setItem(storageOffsetName, +offset + step);
    }

    // отчиска localStorage и возвращение на изначальные состояния
    const onClearList = () => {
        if (offset === 0) {
            uploadCharList(true);
        }
        localStorage.removeItem(storageDataName);
        localStorage.removeItem(storageOffsetName);
        setData(data => []);
        setOffset(0);
    }

    return {
        data,
        setOffset,
        setPressBtn,
        newItemsLoading,
        dataEnded,
        onClearList,
        process
    }
}