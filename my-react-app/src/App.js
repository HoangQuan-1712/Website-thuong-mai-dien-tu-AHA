import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import axios from 'axios'
import DefaultComponents from './components/DefaultComponents/DefaultComponents';
import { useQuery } from '@tanstack/react-query';
import { isJsonString } from './utils';
import { jwtDecode } from "jwt-decode";
import * as UserServices from './services/UserServices'
import { useDispatch } from 'react-redux'
import { updateUser } from './redux/slices/userSlide';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        fetchApi()
        const { storageData, decoded } = handleDecoded()
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const handleDecoded = () => {
    //     try {
    //         let storageData = localStorage.getItem('access_token')
    //         if (!storageData) return { decoded: null, storageData: null }

    //         if (isJsonString(storageData)) {
    //             storageData = JSON.parse(storageData)
    //         }

    //         const decoded = jwtDecode(storageData)
    //         return { decoded, storageData }
    //     } catch (error) {
    //         console.error('Token decode error:', error)
    //         return { decoded: null, storageData: null }
    //     }
    // }

    const handleDecoded = () => {
        try {
            let storageData = localStorage.getItem('access_token');
            let decoded = {}
            if (!storageData) return { decoded: null, storageData: null };

            if (isJsonString(storageData)) {
                storageData = JSON.parse(storageData);
            }

            decoded = jwtDecode(storageData);
            return { decoded, storageData };
        } catch (error) {
            console.error('Token decode error:', error);
            return { decoded: null, storageData: null }; // Không refresh nếu decode fail
        }
    };

    // UserServices.axiosJWT.interceptors.request.use(async function (config) {
    //     const currentTime = new Date()
    //     const { decoded, storageData } = handleDecoded()

    //     if (!config.headers) config.headers = {}
    //     if (decoded?.exp < currentTime.getTime() / 1000) {
    //         try {
    //             const data = await UserServices.refreshToken()
    //             if (data?.access_token) {
    //                 const token = data.access_token
    //                 config.headers['token'] = `Bearer ${token}`
    //                 config.headers['Authorization'] = `Bearer ${token}`
    //                 localStorage.setItem('access_token', JSON.stringify(token))
    //             }
    //         } catch (e) {
    //             console.error('Failed to refresh token', e)
    //             // Clear invalid token
    //             localStorage.removeItem('access_token')
    //         }
    //     } else if (storageData) {
    //         // Valid token exists
    //         config.headers['token'] = `Bearer ${storageData}`
    //         config.headers['Authorization'] = `Bearer ${storageData}`
    //     }
    //     return config;
    // }, function (error) {
    //     // Do something with request error
    //     return Promise.reject(error);
    // });

    UserServices.axiosJWT.interceptors.request.use(async function (config) {
        const currentTime = new Date();
        const { decoded, storageData } = handleDecoded();

        console.log('Interceptor check:', { exp: decoded?.exp, currentTime: currentTime.getTime() / 1000 });

        if (!config.headers) config.headers = {};
        if (decoded?.exp && decoded.exp < currentTime.getTime() / 1000) { // Chỉ refresh khi exp tồn tại và hết hạn
            console.log('Token expired, refreshing...');
            try {
                const data = await UserServices.refreshToken();
                if (data?.access_token) {
                    const token = data.access_token;
                    config.headers['token'] = `Bearer ${token}`;
                    config.headers['Authorization'] = `Bearer ${token}`;
                    localStorage.setItem('access_token', JSON.stringify(token));
                }
            } catch (e) {
                console.error('Refresh failed', e);
                localStorage.removeItem('access_token');
            }
        } else if (storageData) {
            config.headers['token'] = `Bearer ${storageData}`;
            config.headers['Authorization'] = `Bearer ${storageData}`;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });


    const handleGetDetailsUser = async (id, token) => {
        try {
            const res = await UserServices.getDetailsUser(id, token)
            dispatch(updateUser({ ...res?.data, access_token: token }))
        } catch (error) {
            console.error('Error getting user details:', error)
        }
    }

    // Normalize base URL once to avoid double/missing slashes regardless of env value
    const baseUrl = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "/");
    const buildUrl = (path) => `${baseUrl}${String(path).replace(/^\/+/, "")}`;

    const fetchApi = async () => {
        const res = await axios.get(buildUrl('product/getAll'))
        return res.data
    }

    const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
    console.log('query', query);

    return (
        <div>
            <Router>
                <Routes>
                    {routes.map((route) => {
                        const Page = route.page;
                        const Layout = route.isShowHeader ? DefaultComponents : React.Fragment;
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
        </div>
    );
}
export default App