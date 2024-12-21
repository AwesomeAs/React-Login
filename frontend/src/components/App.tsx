import {RouterProvider} from "react-router-dom";
import {router} from '../routes/router';
import './App.css';
import {ProtectedRoute} from "./ProtectedRoute";

export const App = () => {
    return (
        <RouterProvider router={router}/>
    );
}
