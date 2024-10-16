import { Link } from 'react-router-dom';

import withSinglePage from '../../hoc/withSinglePage';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SingleComicPage = (props) => {
    const spinner = props.loading ? <Spinner/> : null,
          errorMessage = props.error ? 
            <div style={{textAlign: 'center'}}>
                <ErrorMessage/>
                <p style={{marginBottom: '10px'}}>{`Возможно комикса с id: ${props.id.comicsId} не существует`}</p>
                <Link to="../.." className="single-comic__back">Вернуться на главную</Link>
            </div>
            : null,
          content = !(props.loading || props.error || !props.data)  ? <Comic data={props.data}/> : null,
          styleComicWrapper = errorMessage ? {gridTemplateColumns: 'auto'} : null

    return (
        <div className="single-comic" style={styleComicWrapper}>
            {spinner}
            {errorMessage}
            {content}

            {
                !errorMessage ? 
                <Link to=".." className="single-comic__back">Back to comics</Link>
                : null
            }
            
        </div>
    )
}

const Comic = ({data}) => {
    const {name, description, pageCount, language, price, thumbnail, url} = data;

    return (
        <>
            <img src={thumbnail} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount} pages</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}$</div>
                <a href={url} style={{marginTop: '15px', color: '#9F0013'}}>Узнать подробнее...</a>
            </div>
        </>
    );
}

const ComicsPageWithSinglePage = withSinglePage(SingleComicPage, 'comic');

export default ComicsPageWithSinglePage;