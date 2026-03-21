import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom"; 
import Login from './feature/auth/Login'
import Register from './feature/auth/Register'

export const router=createBrowserRouter([
    {
        path:'/login',
        element:(<Login/>),
    },
    {
        path:'/register',
        element:(<Register/>)
    }
])