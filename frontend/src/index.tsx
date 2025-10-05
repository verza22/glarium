import { createRoot } from "react-dom/client";
import "./assets/css/index.css"

import City from "./views/City";
import Layout from "./features/layout/Layout";

const App = () => <>
    <Layout />
    <City />
</>;

const root = createRoot(document.getElementById("root")!);
root.render(<App />);