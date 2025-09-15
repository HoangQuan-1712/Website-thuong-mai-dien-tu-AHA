import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import axios from 'axios'
import DefaultComponents from './components/DefaultComponents/DefaultComponents';
import { useQuery } from '@tanstack/react-query';



function App() {

    useEffect(() => {
        fetchApi()
    }, [])

    const fetchApi = async() => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll`)
        return res.data

    }

    const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
    console.log('query', query);

    return ( <
        div >
        <
        Router >
        <
        Routes > {
            routes.map((route) => {
                    const Page = route.page;
                    const Layout = route.isShowHeader ? DefaultComponents : React.Fragment;
                    return ( <
                        Route key = { route.path }
                        path = { route.path }
                        element = { <
                            Layout > < Page / > < /Layout>}/ >
                        );
                    })
            } <
            /Routes>  <
            /Router>  <
            /div>
        );
    }
    export default App