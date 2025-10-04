import { createRoot } from "react-dom/client";
import "./assets/css/index.css"

import { City } from "./views/City";

const App = () => <>
    <City/>
</>;

const root = createRoot(document.getElementById("root")!);
root.render(<App />);