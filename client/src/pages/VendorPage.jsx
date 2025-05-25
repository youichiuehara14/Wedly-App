import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../Context';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import BASE_URL from '../config.js';

const defaultCategories = [
  'Photographer',
  'Catering',
  'Cake',
  'Venue',
  'Wedding Attire',
  'Host',
  'Entertainment',
  'Transportation',
  'Makeup Artist',
  'Photo booth',
  'Other',
];

const highlightMatch = (text, search) => {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export default function VendorPage() {
  const [categories, setCategories] = useState(defaultCategories);
  const [form, setForm] = useState({
    name: '',
    category: '',
    address: '',
    phone: '',
    cost: '',
    email: '',
  });
  const [customCategory, setCustomCategory] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editVendorId, setEditVendorId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const { fetchVendorsPerUser, vendorsObjectsPerUser, setVendorsObjectsPerUser } =
    useContext(Context);

  useEffect(() => {
    fetchVendorsPerUser();
  }, []);

  useEffect(() => {
    const vendorCategories = [
      ...new Set([...defaultCategories, ...vendorsObjectsPerUser.map((v) => v.category)]),
    ];
    setCategories(vendorCategories);
  }, [vendorsObjectsPerUser]);

  const openModal = (vendor = null, index = null) => {
    if (vendor) {
      setForm(vendor);
      setCustomCategory(vendor.category === 'Other' ? vendor.category : '');
      setEditIndex(index);
      setEditVendorId(vendor._id);
    } else {
      setForm({
        name: '',
        category: '',
        address: '',
        phone: '',
        cost: '',
        email: '',
      });
      setCustomCategory('');
      setEditIndex(null);
      setEditVendorId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({
      name: '',
      category: '',
      address: '',
      phone: '',
      cost: '',
      email: '',
    });
    setCustomCategory('');
    setEditIndex(null);
    setEditVendorId(null);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const finalCategory = form.category === 'Other' ? customCategory : form.category;

    if (form.name && finalCategory && form.address && form.phone && form.cost && form.email) {
      try {
        if (editVendorId) {
          const { data } = await axios.put(
            `${BASE_URL}/api/vendor/update-vendor/${editVendorId}`,
            { ...form, category: finalCategory },
            { withCredentials: true }
          );
          toast.success('Vendor updated!');
          setVendorsObjectsPerUser((prev) =>
            prev.map((v) => (v._id === editVendorId ? data.vendor : v))
          );
        } else {
          const { data } = await axios.post(
            `${BASE_URL}/api/vendor/create-vendor`,
            { ...form, category: finalCategory },
            { withCredentials: true }
          );
          toast.success('Vendor added!');
          setVendorsObjectsPerUser((prev) => [...prev, data.vendor]);
        }

        if (!categories.includes(finalCategory)) {
          setCategories((prev) => [...prev, finalCategory]);
        }

        closeModal();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to save vendor');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleDelete = async (index) => {
    const vendor = vendorsObjectsPerUser[index];
    if (!vendor) return;
    if (window.confirm('Delete this vendor?')) {
      try {
        await axios.delete(`${BASE_URL}/api/vendor/delete-vendor/${vendor._id}`, {
          withCredentials: true,
        });
        toast.success('Vendor deleted!');
        setVendorsObjectsPerUser((prev) => prev.filter((v) => v._id !== vendor._id));
      } catch (err) {
        console.error('Delete vendor error:', err);
        toast.error(err.response?.data?.message || 'Failed to delete vendor');
      }
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = vendorsObjectsPerUser
    .filter((v) => {
      const searchTerm = search.toLowerCase();
      const safeLower = (str) => (typeof str === 'string' ? str.toLowerCase() : '');

      const matchesSearch =
        safeLower(v.name).includes(searchTerm) ||
        safeLower(v.phone).includes(searchTerm) ||
        safeLower(v.email).includes(searchTerm) ||
        safeLower(v.address).includes(searchTerm) ||
        safeLower(v.category).includes(searchTerm) ||
        v.cost.toString().toLowerCase().includes(searchTerm);

      const matchesCategory = filterCategory ? v.category === filterCategory : true;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Handle cases where fields might be undefined
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // For numbers (like cost)
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

  // Date formatting helper (simple YYYY-MM-DD HH:mm)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const exportVendorsToExcel = () => {
    if (!vendorsObjectsPerUser || vendorsObjectsPerUser.length === 0) {
      toast.error('No vendors to export');
      return;
    }

    // Prepare data for export
    const data = vendorsObjectsPerUser.map((vendor) => ({
      'Vendor ID': vendor._id,
      Name: vendor.name || '',
      Category: vendor.category || '',
      Address: vendor.address || '',
      Phone: vendor.phone || '',
      Email: vendor.email || '',
      Cost: vendor.cost != null ? vendor.cost : '',
      'Created At': formatDate(vendor.createdAt),
      'Updated At': formatDate(vendor.updatedAt),
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');

    // Write workbook to binary and save
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'vendors.xlsx');
  };

  return (
    <div className="min-h-screen bg-[#2d2f25] rounded-4xl text-black p-4 shadow-neumorphism-inset">
      <div className="h-screen rounded-4xl p-5 ">
        <h1 className="text-xl sm:text-3xl font-bold mb-6 inline-block px-5 py-2 ">Vendors</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            className="border-1 border-gray-500 p-2 rounded-lg w-full sm:w-1/3 text-black focus:outline-none text-sm sm:text-base"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border-1 border-gray-500 p-2 rounded-lg sm:w-3/10 md:w-2/10 lg:w-2/10 text-black focus:outline-none text-sm sm:text-base"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-black">
                {cat}
              </option>
            ))}
          </select>
          <button
            className="border-[#5050509d] border-1 text-black px-4 py-2 rounded-lg hover:bg-[#565a47] hover:text-white cursor-pointer transition-all duration-300 w-full sm:w-auto text-sm sm:text-base"
            onClick={() => openModal()}
          >
            Add Vendor
          </button>
          <button
            className="border-[#5050509d] border-1 text-black px-4 py-2 rounded-lg hover:bg-[#565a47] hover:text-white  cursor-pointer transition-all duration-300  w-full sm:w-auto text-sm sm:text-base"
            onClick={exportVendorsToExcel}
          >
            Export Excel
          </button>
        </div>

        <div className="rounded-4xl shadow-lg shadow-neumorphism-inset p-8">
          <table className="min-w-full  text-black">
            <thead>
              <tr className=" text-left text-xs sm:text-base">
                <th
                  className="p-3 sm:p-4 cursor-pointer sm:text-lg"
                  onClick={() => toggleSort('name')}
                >
                  Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="p-3 sm:p-4 sm:text-lg hidden xl:table-cell">Category</th>
                <th className="p-3 sm:p-4 sm:text-lg hidden sm:table-cell">Address</th>
                <th className="p-3 sm:p-4 sm:text-lg table-cell">Phone</th>
                <th
                  className="p-3 sm:p-4 sm:text-lg cursor-pointer hidden sm:table-cell"
                  onClick={() => toggleSort('cost')}
                >
                  Cost
                </th>
                <th className="p-3 sm:p-4 sm:text-lg hidden lg:table-cell">Email</th>
                <th className="p-3 sm:p-4 sm:text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((v, i) => (
                  <tr
                    key={v._id || i}
                    className="border-t border-[#323529] duration-200 transition-all"
                  >
                    <td className="p-3 sm:p-4 text-xs sm:text-lg">
                      {highlightMatch(v.name || '', search)}
                    </td>
                    <td className="p-3 sm:p-4 text-xs hidden xl:table-cell sm:text-lg">
                      {highlightMatch(v.category || '', search)}
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell text-xs sm:text-lg">
                      {highlightMatch(v.address || '', search)}
                    </td>
                    <td className="p-3 sm:p-4 table-cell text-xs sm:text-lg">
                      {highlightMatch(v.phone || '', search)}
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell text-xs sm:text-lg">
                      {highlightMatch(`Php ${Number(v.cost).toLocaleString()}`, search)}
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell text-xs sm:text-lg">
                      {highlightMatch(v.email || '', search)}
                    </td>
                    <td className="p-3 sm:p-4 space-x-2">
                      <div className="flex flex-col lg:flex-row gap-2">
                        <button
                          onClick={() => openModal(v, i)}
                          className="text-black cursor-pointer text-xs sm:text-lg hover:underline "
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(i)}
                          className="text-black cursor-pointer text-xs sm:text-lg hover:underline "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500 text-sm sm:text-base">
                    No vendors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
              <h2 className="text-xl font-semibold mb-4">
                {editIndex !== null ? 'Edit Vendor' : 'Add Vendor'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    name="name"
                    placeholder="Vendor Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg  focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg  focus:outline-none text-sm"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {form.category === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Custom Category</label>
                    <input
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter Custom Category"
                      className="w-full border border-gray-300 p-2 rounded-lg  focus:outline-none text-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg  focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg  focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cost</label>
                  <input
                    name="cost"
                    type="number"
                    placeholder="Cost"
                    value={form.cost}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg  focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date (Optional)</label>
                  <input
                    name="dueDate"
                    type="date"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg  focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg  focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  className="border-1 hover:bg-[#565a47] hover:text-white cursor-pointer text-[#2d2f25] px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={closeModal}
                  className="border-1 hover:bg-[#565a47] hover:text-white cursor-pointer text-[#2d2f25] px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
