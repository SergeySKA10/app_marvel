import { createRoot } from "react-dom/client";
import App from "./components/app/App";
import MarvelService from './services/MarvelService';

import "./style/style.scss";

const _api = process.env.REACT_APP_MY_API_KEY;

const herosMarvel = new MarvelService(_api);
herosMarvel.getAllCharacters().then(data => console.log(data));
herosMarvel.getCharacter('1009144').then(data => console.log(data));

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
