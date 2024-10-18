import { Link } from 'react-router-dom';

import withSinglePage from '../../hoc/withSinglePage';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SingleHerouPage = (props) => {
    const spinner = props.loading ? <Spinner/> : null,
          errorMessage = props.error || (props.data.length === 0 && !props.loading) ? 
            <div style={{textAlign: 'center'}}>
                <ErrorMessage/>
                <p style={{marginBottom: '10px'}}>{`Возможно героя под именем: ${props.id.herouId} не существует`}</p>
                <Link to=".." className="single-comic__back">Вернуться на главную</Link>
            </div>
            : null,
          content = !(props.loading || props.error || props.data.length === 0)  ? <Herou data={props.data}/> : null,
          styleComicWrapper = errorMessage ? {gridTemplateColumns: 'auto'} : null;

    return (
    <div className="single-comic" style={styleComicWrapper}>
        {spinner}
        {errorMessage}
        {content}

        {
            !errorMessage ? 
            <Link to=".." className="single-comic__back">Back to main</Link>
            : null
        }
        
    </div>
    )
}

const Herou = ({data}) => {
    const {name, description, thumbnail} = data[0];

    return (
        <>
            <img src={thumbnail} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
            </div>
        </>
    );
}

const HerouPageWithSinglePage = withSinglePage(SingleHerouPage, 'herou');

export default HerouPageWithSinglePage;