import { Link } from 'react-router-dom';

import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';
import Spinner from '../components/spinner/Spinner';

// функция для рендеринга одиночных компонентов в определенный момент
const setContent = (process, data, Component, skeleton = false, single = null) => {
    switch (process) {
        case 'waiting':
            return skeleton ? <Skeleton/> : null;
        case 'loading':
            return <Spinner/>
        case 'confirmed':
            return <Component data={data}/>
        case 'error':
            return !single ? <ErrorMessage/> :
                <div style={{textAlign: 'center'}}>
                    <ErrorMessage/>
                    <p style={{marginBottom: '10px'}}>{`Возможно такого ${single.single === 'comic' ? 'комикса' : 'героя'} не существует`}</p>
                    <Link to="../.." className="single-comic__back">Вернуться на главную</Link>
                </div>
        default: 
            throw new Error('Process not found')
    }
}

// функция для рендеринга компонентов со списком в определенный момент
const setList = (process, Component, newItemsLoading) => {
    switch (process) {
        case 'waiting':
            return <Component/>
        case 'loading':
            return newItemsLoading ? <Component/> : <Spinner/>
        case 'confirmed':
            return <Component/>
        case 'error':
            return <ErrorMessage/>
        default: 
            throw new Error('Process not found')
    }
}

export default setContent;
export { setList };