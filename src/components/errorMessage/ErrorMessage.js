import ErrorImg from "./ErrorImg";

const ErrorMessage = () => {
    return (
        <div>
            <ErrorImg/>
            <p>Произошла ошибка при загрузкe данных с сервера</p>
        </div>
    );
}

export default ErrorMessage;