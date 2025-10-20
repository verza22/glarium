import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./../screens/Login";
import Register from "./../screens/Register";
import City from "./../screens/City";
import Island from "./../screens/Island";
import World from "./../screens/World";
import AppRoute from "./AppRoute";

const RoutesApp = () => <>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1>404, Page not found</h1>} />

            <Route path="/city/:cityId" element={<AppRoute><City /></AppRoute>} />
            <Route path="/island/:islandId" element={<AppRoute><Island /></AppRoute>} />
            <Route path="/world" element={<AppRoute><World /></AppRoute>} />
        </Routes>
    </BrowserRouter>
</>;

export default RoutesApp;