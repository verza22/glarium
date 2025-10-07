import { createRoot } from "react-dom/client";
import "./assets/css/index.css"
import RoutesApp from "./routes";
import "./i18n";

const App = () => <>
    <RoutesApp />
</>;

const root = createRoot(document.getElementById("root")!);
root.render(<App />);