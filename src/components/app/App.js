import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import AppHeader from "../appHeader/AppHeader";
// import { MainPage, ComicsPage, SingleComicPage } from "../pages";
import Spinner from "../spinner/Spinner";

const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const ComicsPageWithSinglePage = lazy(() => import('../pages/SingleComicPage'));
const HerouPageWithSinglePage = lazy(() => import('../pages/SingleHerouPage'));
const ErrorPage = lazy(() => import('../pages/404'));


const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <Suspense fallback={<Spinner/>}>
                    <main>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/comics">
                                <Route index element={<ComicsPage/>}/>
                                <Route path=":comicsId" element={<ComicsPageWithSinglePage/>}/>
                            </Route>
                            <Route path="characters/:herouId" element={<HerouPageWithSinglePage/>}/>
                            <Route path="*" element={<ErrorPage/>}/>
                        </Routes>
                    </main>
                </Suspense>
            </div>
        </Router>
    )

}

export default App;
