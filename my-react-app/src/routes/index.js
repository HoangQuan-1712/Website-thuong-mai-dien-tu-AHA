import HomePage from '../pages/HomePage/HomePage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import TypeProductPage from '../pages/TypeProductPage/TyperoductPage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import SignInPageNumberPhone from '../pages/SignInPage/SignInPageNumberPhone';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import PassForPhoneNumber from '../pages/SignUpPage/PassForPhoneNumber';
import ForgotPassword from '../pages/SignUpPage/ForgotPassword';

export const routes = [{
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: '/type',
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/sign-in-numberphone',
        page: SignInPageNumberPhone,
        isShowHeader: false
    },
    {
        path: '/pass-for-phonenumber',
        page: PassForPhoneNumber,
        isShowHeader: false
    },
    {
        path: '/forgot-password',
        page: ForgotPassword,
        isShowHeader: false
    },
    {
        path: '/product-details',
        page: ProductDetailsPage,
        isShowHeader: true
    },
    {
        path: '/*',
        page: NotFoundPage
    },
];