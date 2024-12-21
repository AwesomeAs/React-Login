import { createBrowserRouter } from "react-router-dom";
import {basename, routes} from "./routes";
import {HomePage} from "../components/pages/HomePage";
import {TestPage} from "../components/pages/TestPage";
import {Error404Page} from "../components/pages/Error404Page";
import {Frame} from "../components/Frame";
import { LoginPage } from "../components/pages/LoginPage";
import { SignupPage } from "../components/pages/SignupPage";
import { AdminPage } from "../components/pages/AdminPage";
import { ProfilePage } from "../components/pages/ProfilePage";

export const router = createBrowserRouter([
    {
        path: routes.login.pattern,
        element: (<LoginPage/>)
    },
    {
        path: routes.signup.pattern,
        element: (<SignupPage/>)
    },
    {
        path: routes.home.pattern,
        element: (<Frame/>),
        children: [
            {
                index: true,
                element: (<HomePage/>),
            },
            {
                path: routes.profile.pattern,
                element: (<ProfilePage/>),
            },
            {
                path: routes.admin.pattern,
                element: (<AdminPage/>),
            },
            {
                path: routes.test.pattern,
                element: (<TestPage/>),
            },
        ]
    },
    {
        path: routes.notFound.pattern,
        element: (<Error404Page/>)
    }
], { basename: basename });