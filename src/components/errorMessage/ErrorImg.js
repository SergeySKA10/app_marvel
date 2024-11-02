import img from '../../resources/img/error.gif';

const ErrorImg = () => {
    return (
        <div style={{display: 'block', margin: "0 auto", alignContent: 'center'}}>
            <img style={{display: 'block', width: "150px", height: "150px", objectFit: 'contain', margin: "0 auto", borderRadius: '10px'}} src={img} alt="Message about error" />
        </div>
        
    )
}

export default ErrorImg;