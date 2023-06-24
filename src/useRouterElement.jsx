import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import AdminPage from './pages/AdminPage/AdminPage.jsx'
import Login from './pages/Login/Login'
import NotFound404 from './pages/NotFound404/NotFound404'
import OrderStatus from './components/OrderStatus/OrderStatus.jsx'
import Products from './components/Products/Products.jsx'
import Users from './components/Users/Users.jsx'
import Empoyee from './components/Employee/Employee.jsx'
import CreateProduct from './components/CreateProducts/CreateProduct.jsx'
import Category from './components/Category/Category.jsx'
import UpdateProduct from './components/UpdateProduct/UpdateProduct.jsx'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context.jsx'
import DetailOrderStatus from './components/DetailOrderStatus/DetailOrderStatus.jsx'

// ------kiểm tra login nếu login đúng thì cho vào k thì đá sang /system/login
function ProtectedRouter() {
  const { isAuthenticated } = useContext(AppContext)
  // const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/system/login' />
}
// -----nếu user đã Login r thì k cho vào login nữa
//     nếu vẫn cố truy cập login thì cho về trang chủ
function RejectRouter() {
  const { isAuthenticated } = useContext(AppContext)
  // const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/system' />
}

export default function useRouterElement() {
  const routeElements = useRoutes([
    {
      path: '/system',
      element: <ProtectedRouter />,
      children: [
        {
          path: '/system',
          element: <AdminPage />,
          children: [
            {
              path: '/system/orders',
              element: <OrderStatus />
            },
            {
              path: '/system/products',
              element: <Products />
            },
            {
              path: '/system/categories',
              element: <Category />
            },
            {
              path: '/system/users',
              element: <Users />
            },
            {
              path: '/system/employees',
              element: <Empoyee />
            },
            {
              path: '/system/products/product/:idCategory',
              element: <CreateProduct />
            },
            {
              path: '/system/products/update/:idProduct',
              element: <UpdateProduct />
            },
            {
              path: '/system/detailOrderStatus',
              element: <DetailOrderStatus />
            }
          ]
        }
      ]
    },
    {
      path: '/system',
      element: <RejectRouter />,
      children: [
        {
          path: '/system/login',
          element: <Login />
        },
        {
          path: '/system/forgotpassword',
          element: <ForgotPassword />
        }
      ]
    },

    {
      path: '/system/*',
      element: <NotFound404 />
    }
  ])
  return routeElements
}
