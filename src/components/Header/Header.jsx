import { Link } from 'react-router-dom'
import Dropdown from '../Dropdown/Dropdown'
export default function Header() {
  return (
    <header>
      <nav className='bg-slate-200 border-gray-200 px-4 lg:px-6 pt-2 dark:bg-gray-800'>
        <div className='flex flex-wrap justify-between items-center max-w-screen-xl'>
          <Link to='/system/orders' className='flex'>
            <img
              className='mb-2 h-20 w-40 rounded-md bg-white object-cover py-2 shadow-lg'
              src='https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=819.000032544136,fit=crop/YbNbPPqn2EfwxjP7/chat-hon-to-cu-1-png-m7V2704oB7HDV1b2.png'
              alt='Goomo Home logo'
              data-v-fb585256
              data-qa='builder-siteheader-img-logo'
            />
          </Link>
          <div className='flex items-center lg:order-2'>
            {/* thông tin đăng nhập */}
            <Dropdown />
          </div>
        </div>
      </nav>
    </header>
  )
}
