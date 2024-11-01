import { Link } from 'react-router-dom';
import withSinglePage from '../../hoc/withSinglePage';
import setContent from '../../utils/setContent';

const SingleComicPage = (props) => {
    const styleComicWrapper = props.process === "error" || props.process === "loading" ? {gridTemplateColumns: 'auto'} : null

    return (
        <div className="single-comic" style={styleComicWrapper}>
            {setContent(props.process, props.data, Comic, false, {single: 'comic'})}
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
                <Link to=".." className='single-comic__back'>Вернуться назад</Link>
            </div>
        </>
    );
}

const ComicsPageWithSinglePage = withSinglePage(SingleComicPage, 'comic');

export default ComicsPageWithSinglePage;