import withSinglePage from '../../hoc/withSinglePage';
import setContent from '../../utils/setContent';

const SingleHerouPage = (props) => {
    const styleComicWrapper = props.process === "error" || props.process === "loading" ? {gridTemplateColumns: 'auto'} : null;

    return (
    <div className="single-comic" style={styleComicWrapper}>
        { setContent(props.process, props.data, Herou, false, {single: 'herou'}) } 
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