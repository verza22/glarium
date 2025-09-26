import React from "react";
import { createRoot } from "react-dom/client";

const App = () => <h1>test from React</h1>;

const root = createRoot(document.getElementById("root")!);
root.render(<App />);