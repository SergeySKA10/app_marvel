import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import useMarvelService from "../services/MarvelService";
import AppBanner from "../components/appBanner/AppBanner";

import './singleComic.scss';

const withSinglePage = (BaseComponent, initial) => {
    return (props) => {
        const [data, setData] = useState(null),
              {loading, error, getComic, getCharacterName, clearError} = useMarvelService(),
              id = useParams();

        useEffect(() => {
            updateData(id);
        }, [id]);

        const updateData = (id) => {
            clearError();

            switch(initial) {
                case 'comic':
                    getComic(id.comicsId)
                        .then(onLoadedData)
                    break;
                case 'herou':
                    getCharacterName(id.herouId)
                        .then(onLoadedData)
                    break;
                default:
                    throw new Error(`${initial} not found`);
            }
        };

        const onLoadedData = (newData) => {
            setData(newData);
        };

        return (
            <>  
                <Helmet>
                    <meta
                        name='description'
                        content={`${initial} page`}/>
                    <title>{`${initial} page`}</title>
                </Helmet>
                <AppBanner/>
                <BaseComponent
                    {...props}
                    id={id}
                    data={data}
                    loading={loading}
                    error={error}/>
            </>
        ); 
    }
}

export default withSinglePage;