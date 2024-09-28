import { NavLink, Link } from 'react-router-dom/cjs/react-router-dom.min';


import './appHeader.scss';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Marvel</span> information portal
                </Link>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><NavLink exact to="/" activeStyle={{color: '#9F0013'}}>Characters</NavLink></li>
                    /
                    <li><NavLink exact to="/comics" activeStyle={{color: '#9F0013'}}>Comics</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;