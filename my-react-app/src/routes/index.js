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
import Register from '../pages/SignUpPage/Register';
import ProfilePage from '../pages/Profile/ProfilePage';

export const routes = [{
    path: '/',
    page: HomePage,
    isShowHeader: true
},
{
    path: '/order',
    page: OrderPage,
    isShowHeader: true,
    isShowFooter: true
},
{
    path: '/products',
    page: ProductsPage,
    isShowHeader: true,
    isShowFooter: true
},
{
    path: '/type',
    page: TypeProductPage,
    isShowHeader: true,
    isShowFooter: true
},
{
    path: '/sign-in',
    page: SignInPage,
    isShowHeader: false,
    isShowFooter: false
},
{
    path: '/sign-up',
    page: SignUpPage,
    isShowHeader: false,
    isShowFooter: false
},
{
    path: '/sign-in-numberphone',
    page: SignInPageNumberPhone,
    isShowHeader: false,
    isShowFooter: false
},
{
    path: '/pass-for-phonenumber',
    page: PassForPhoneNumber,
    isShowHeader: false,
    isShowFooter: false
},
{
    path: '/forgot-password',
    page: ForgotPassword,
    isShowHeader: false,
    isShowFooter: false
},
{
    path: '/register',
    page: Register,
    isShowHeader: false,
    isShowFooter: false
},
{
    path: '/product-details',
    page: ProductDetailsPage,
    isShowHeader: true,
    isShowFooter: true
},
{
    path: '/profile/*',
    page: ProfilePage,
    isShowHeader: true,
    isShowFooter: true
},
{
    path: '/*',
    page: NotFoundPage
},
];