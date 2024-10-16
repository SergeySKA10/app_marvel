import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';

import "./SearchCharsForm.scss";

const SearchCharForm = () => {
    const [herou, setHerou] = useState('');

    const {loading, getCharacterName} = useMarvelService();

    const uploadChar = (name) => {
        getCharacterName(name)
            .then(data => {
                setHerou(data.name);
            })
            .catch(error => setHerou(`${name} не существует`));
    }

    return (
        <Formik 
            initialValues={{
                charName: ''
            }}
            validationSchema={Yup.object({
                charName: Yup.string()
                .matches(/\D/, "Не допустимый символ")
                .required('Обязательное поле для заполнения!')
            })}
            onSubmit={value => {
                uploadChar(value.charName);
            }}
        >
            <div className="char__search-form">
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit'
                            disabled={loading} 
                            className="button button__main">
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <ErrorMessage className="char__search-critical-error" name='charName' component='div'/>
                    {
                        !herou ? 
                            null 
                            : herou.includes('не существует') ?
                                <div className="char__search-error">{`Герой ${herou} во Вселенной Marvel`}</div>
                                :
                                <div style={{display: 'flex', marginTop: '20px'}}>
                                    <div className="char__search-success">{`Герой ${herou} найден, открыть карточку героя?`}</div>
                                    <Link to={`${herou}`}>
                                        <button 
                                            type='submit' 
                                            className="button button__secondary">
                                            <div className="inner">Open</div>
                                        </button>
                                    </Link>
                                </div> 
                    }
                </Form>
            </div>
        </Formik>
        
    );
}

export default SearchCharForm;