import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./../views/Login";
import Register from "./../views/Register";
import City from "./../views/City";
import Island from "./../views/Island";
import World from "./../views/World";

const RoutesApp = () => <>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/city" element={<City />} />
            <Route path="/island" element={<Island />} />
            <Route path="/world" element={<World />} />
            <Route path="*" element={<h1>404, Page not found</h1>} />
        </Routes>
    </BrowserRouter>
</>;

export default RoutesApp;