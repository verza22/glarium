import { createRoot } from "react-dom/client";
import "./assets/css/index.css"
import RoutesApp from "./routes";

const App = () => <>
    <RoutesApp />
</>;

const root = createRoot(document.getElementById("root")!);
root.render(<App />);