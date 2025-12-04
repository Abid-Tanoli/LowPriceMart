import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <div className="text-2xl font-bold ml-10">
        <h1 className='bg-Green-300 text-extrabold'>LOGO</h1>
      </div>

      <div className="space-x-12 mr-10">
        <Link className="hover:text-gray-200" to="/" >Home</Link>
        <Link className="hover:text-gray-200" to="/Product" >Product</Link>
        <Link className="hover:text-gray-200" to="/cart" >Cart</Link>

          {user && (
          <Link className="hover:text-gray-200" to="/orders">My Orders</Link>
        )}

        {user ? (
          <Link className="hover:text-gray-200" to="/profile">Profile</Link>
        ) : (
          <Link className="hover:text-gray-200" to="/Login">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Header
