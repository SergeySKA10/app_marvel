import img from '../../resources/img/error.gif';

const ErrorMessage = () => {
    return (
        <div style={{display: 'block', margin: "0 auto", alignContent: 'center'}}>
            <img style={{display: 'block', width: "150px", height: "150px", objectFit: 'contain', margin: "0 auto"}} src={img} alt="Message about error" />
            <p style={{textAlign: 'center', color: '#9F0013'}}>Произошла ошибка при загурзке данных с сервера</p>
        </div>
        
    )
}

export default ErrorMessage;