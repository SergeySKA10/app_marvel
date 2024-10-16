import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import ErrorImg from "../errorMessage/ErrorImg";

const ErrorPage = () => {
    return (
        <>
            <Helmet>
                <meta
                    name='description'
                    content='Error page'/>
                <title>Error page</title>
            </Helmet>
            <div style={{display: 'block', margin: '0 auto', textAlign: 'center'}}>
                <ErrorImg/>
                <p>Вы перешли на несуществующую страницу</p>
                <Link to=".." style={{marginTop: '10px', color: '#9F0013'}}>Вернуться на главную страницу</Link>
            </div>
        </>

    )
}

export default ErrorPage;