import { Link } from "react-router-dom";
import ErrorImg from "../errorMessage/ErrorImg";

const ErrorPage = () => {
    return (
        <div style={{display: 'block', margin: '0 auto', textAlign: 'center'}}>
            <ErrorImg/>
            <p>Вы перешли на несуществующую страницу</p>
            <Link to=".." style={{marginTop: '10px', color: '#9F0013'}}>Вернуться на главную страницу</Link>
        </div>
    )
}

export default ErrorPage;