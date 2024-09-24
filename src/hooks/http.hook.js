import { useState, useCallback } from "react";

// custom hook по запросу данных с внутренними состояниями загрузки и ошибки

export const useHttp = () => {
    // изначальное состояние загрузки и ошибки
    const [loading, setLoading] = useState(false),
          [error, setError] = useState(null);

    // запрос на сервер, используем usecallback для хеширования функции
    const request = useCallback(async (url, method = "GET", body = null, headers = {'Content-Type': 'application/json'}) => {
        setLoading(true); // изменение состояния загрузки - спиннер между загрузками

        // используем try catch чтобы поймать ошибку
        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, starus: ${response.status}`);
            }

            const data = await response.json(); // обработка ответа

            setLoading(false); // изменение состояния загрузки

            return data;

        } catch (e) {
            setLoading(false); // изменение состояния загрузки
            setError(e.message); // изменение состояния ошибки
            throw e
        }

    }, []);

    // функция отчиски ошибки 
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        request,
        clearError
    }
};