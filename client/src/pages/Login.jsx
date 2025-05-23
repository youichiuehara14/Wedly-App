import { useState, useContext } from 'react';
import { Context } from '../Context';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
  const { fetchUser } = useContext(Context);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginFormData;
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/user/login',
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        await fetchUser();
        setLoginFormData({
          email: '',
          password: '',
        });
        toast.success('Logged in successfully!');

        navigate('/home/overview');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again later.');
      }
      console.log(error);
    }
  };

  // console.log(cartSummary);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className=" flex justify-center items-center pb-8 px-4 sm:px-6 lg:px-8 mt-30">
          <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Login to Your Account
            </h1>
            <p className="text-sm text-gray-600 text-center mt-1">
              Enter your credentials to access your account.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={loginFormData.email}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="john@example.com"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Password
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginFormData.password}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500 pr-10" // Add padding-right for the button
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 hover:underline focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
