import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Products from '../components/Product/Product';
import ProductDetail from '../components/ProductDetail/ProductDetail';
import MyProducts from '../components/MyProducts/MyProducts';
import Wishlist from '../components/Wishlist/Wishlist';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Products />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetail />
      },
      {
        path: "/my-products",
        element: <MyProducts />
      },
      {
        path: "/wishlist",
        element: <Wishlist />
      }
    ],
  },
]);
