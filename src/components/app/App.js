//import { Component } from "react";
import { useState } from "react";

import AppHeader from "../appHeader/AppHeader";
import AppBanner from "../appBanner/AppBanner";
// import RandomChar from "../randomChar/RandomChar";
// import CharList from "../charList/CharList";
// import CharInfo from "../charInfo/CharInfo";
// import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import ComicsList from "../comicsList/ComicsList";
//import SingleComic from "../singleComic/SingleComic";

import decoration from '../../resources/img/vision.png';

const App = () => {
    const [selectedChar, setSelectedChar] = useState(null);

    const onCharSelected = (id) => {
        setSelectedChar(selectedChar => id);
    }

    return (
        <div className="app">
            <AppHeader/>
            <main>
                {/* <RandomChar/>
                <div className="char__content">
                    <CharList onCharSelected={onCharSelected}/>
                    <ErrorBoundary>
                        <CharInfo charId={selectedChar}/>
                    </ErrorBoundary>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision"/> */}

                <AppBanner/>
               <ComicsList/>

            </main>
        </div>
    )

}

export default App;


// export default class App extends Component {
//     state = {
//         selectedChar: null
//     }

//     onCharSelected = (id) => {
//         this.setState({
//             selectedChar: id
//         });
//     }
    
//     render() {
//         return (
//             <div className="app">
//                 <AppHeader/>
//                 <main>
//                     <RandomChar/>
//                     <div className="char__content">
//                         <CharList onCharSelected={this.onCharSelected}/>
//                         <ErrorBoundary>
//                             <CharInfo charId={this.state.selectedChar}/>
//                         </ErrorBoundary>
//                     </div>
//                     <img className="bg-decoration" src={decoration} alt="vision"/>
//                 </main>
//             </div>
//         )
//     }
// }
