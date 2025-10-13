import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./assets/css/index.css"
import RoutesApp from "./routes";
import "./i18n";

const queryClient = new QueryClient();

const App = () => <>
    <QueryClientProvider client={queryClient}>
        <RoutesApp />
    </QueryClientProvider>
</>;

const root = createRoot(document.getElementById("root")!);
root.render(<App />);