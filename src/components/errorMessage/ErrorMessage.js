import img from '../../resources/img/error.gif';

const ErrorMessage = () => {
    return (
        <img style={{display: 'block', width: "250px", height: "250px", objectFit: 'contain', margin: "0 auto"}} src={img} alt="Message about error" />
    )
}

export default ErrorMessage;