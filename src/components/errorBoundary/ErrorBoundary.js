import { Component } from "react";
import img from '../../resources/img/error.gif';

export default class ErrorBoundary extends Component {
    state = {
        error: false
    }

    errorHeader = '';
    errorMessage = '';

    componentDidCatch(error, errorInfo) {
        this.errorHeader = `${error.name}:${error.message}`;
        this.errorMessage = `${errorInfo.componentStack}`;
        this.setState({
            error: true
        });
    }

    render() {
        if (this.state.error) {
            return (
                <div style={{display: 'block', margin: '20px auto'}}>
                    <img src={img} alt="Error" style={{display: 'block', margin: '0 auto'}}/>
                    <p style={{textAlign: 'center'}}> 
                        Произошла ошибка: {this.errorHeader}
                        <p style={{margin: "10px 0"}}>
                            {this.errorMessage}
                        </p>
                        Если вы видете данное сообщение пожалуйста сообщите нам
                    </p>
                </div>
            )
        }

        return this.props.children
    }
}