import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./../screens/Login";
import Register from "./../screens/Register";
import City from "./../screens/City";
import Island from "./../screens/Island";
import World from "./../screens/World";
import ProtectedRoute from "./ProtectedRoute";

const RoutesApp = () => <>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1>404, Page not found</h1>} />

            <Route
                path="/city/:cityId"
                element={
                    <ProtectedRoute>
                        <City />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/island/:islandId"
                element={
                    <ProtectedRoute>
                        <Island />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/world"
                element={
                    <ProtectedRoute>
                        <World />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </BrowserRouter>
</>;

export default RoutesApp;