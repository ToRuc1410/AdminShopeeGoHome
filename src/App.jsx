import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRouterElement from './useRouterElement'

function App() {
  const routerElement = useRouterElement()
  return (
    <>
      {routerElement}
      <ToastContainer />
    </>
  )
}

export default App
