import { useContext, useEffect, useState } from 'react';
import { Context } from '../Context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

function AccountPage() {
  const { user, setUser } = useContext(Context);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (user === null && !loading) {
      navigate('/login');
    } else if (user) {
      setFormData({
        // Set form data with user information as initial values
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
      setLoading(false);
    }
  }, [user, navigate, loading]);

  console.log(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        setUser(updatedUser);

        toast.success('User information updated successfully');

        setEditing(false); // Exit editing mode
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update user information');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      toast.error('Failed to update user information');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Account Information
      </h2>

      <div className="flex flex-col md:flex-row md:justify-between gap-2">
        {/* Form Section */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!editing}
              className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                editing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!editing}
              className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                editing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editing}
              className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                editing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!editing}
              className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                editing ? 'bg-white' : 'bg-gray-100'
              }`}
            />
          </div>
        </div>

        {/* Button Section */}
        <div className="flex-1 flex flex-col justify-center items-center gap-4 mt-6 md:mt-0">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="w-36 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm cursor-pointer"
            >
              Update Information
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveChanges}
                className="w-36 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-sm cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="w-36 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition text-sm cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}

          <Link
            to="/home/change-password"
            className="w-36 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-300 transition text-sm text-center"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
