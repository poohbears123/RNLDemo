import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "../components/Table";
import FloatingLabelInput from "../components/input/FloatingLabelInput";
import FloatingLabelSelect from "../components/Select/FloatingLabelSelect";

const API_USERS = 'http://localhost:8000/api/users';
const API_GENDERS = 'http://localhost:8000/api/genders';

interface Gender {
  id: number;
  name: string;
}

interface User {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  name: string;
  gender_id: number;
  gender: Gender | null;
  address: string;
  dob: string;
  username: string;
  status: "Active" | "Inactive";
}

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  genderId: number;
  dob: string;
  username: string;
  password: string;
  confirmPassword: string;
  status: "Active" | "Inactive";
  address: string;
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    genderId: 0,
    dob: "",
    username: "",
    password: "",
    status: "Active",
    confirmPassword: "",
    address: "",
  });

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(API_USERS);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGenders = async () => {
    try {
      const { data } = await axios.get(API_GENDERS);
      setGenders(data);
    } catch (error) {
      console.error('Error fetching genders:', error);
    }
  };

  useEffect(() => {
    fetchGenders();
    fetchUsers();
    setLoading(false);
  }, []);

  const openCreateModal = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      genderId: 0,
      dob: "",
      username: "",
      password: "",
      status: "Active",
      confirmPassword: "",
      address: "",
    });
    setEditingUser(null);
    setShowModal("create");
  };

  const openEditModal = (user: User) => {
    setFormData({
      firstName: user.firstName,
      middleName: user.middleName || '',
      lastName: user.lastName,
      suffix: user.suffix || '',
      genderId: user.gender_id || 0,
      dob: user.dob || '',
      username: user.username,
      password: '',
      status: user.status,
      confirmPassword: '',
      address: user.address || '',
    });
    setEditingUser(user);
    setShowModal("edit");
  };

  const openDeleteModal = (id: number) => {
    setDeleteConfirmId(id);
    setShowModal("delete");
  };

  const closeModal = () => {
    setShowModal(null);
    setEditingUser(null);
    setDeleteConfirmId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof FormData]: value }));
  };

  const saveUser = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.username || formData.password !== formData.confirmPassword || formData.genderId === 0) {
      alert('Please fill required fields, match passwords, select gender');
      return;
    }

    const payload = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      suffix: formData.suffix,
      genderId: formData.genderId,
      dob: formData.dob,
      username: formData.username,
      password: editingUser ? formData.password || undefined : formData.password,
      status: formData.status,
      address: formData.address,
    };

    try {
      if (editingUser) {
        await axios.put(`${API_USERS}/${editingUser.id}`, payload);
      } else {
        await axios.post(API_USERS, payload);
      }
      closeModal();
      fetchUsers();
    } catch (err: any) {
      const error = err.response?.data;
      if (error?.message) {
        alert(error.message);
      } else if (error?.errors) {
        const msgs = Object.values(error.errors as Record<string, string[]>).flat().join('\\n');
        alert(`Validation failed:\\n${msgs}`);
      } else {
        alert('Failed to save user');
      }
    }
  };

  const deleteUser = async () => {
    if (deleteConfirmId) {
      try {
        await axios.delete(`${API_USERS}/${deleteConfirmId}`);
        closeModal();
        fetchUsers();
      } catch (err: any) {
        const error = err.response?.data || err.message;
        alert(`Failed to delete user: ${typeof error === 'string' ? error : 'Unknown error'}`);
      }
    }
  };

  const ModalOverlay = ({ title, children, onConfirm, confirmText = "Save", onCancel }: {
    title: string;
    children: React.ReactNode;
    onConfirm: () => void;
    confirmText?: string;
    onCancel?: () => void;
  }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel || closeModal}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button 
            onClick={onCancel || closeModal} 
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <button 
            onClick={openCreateModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            + Add User
          </button>
        </div>

        <div className="bg-white shadow-xl ring-1 ring-gray-900/5 rounded-xl overflow-hidden max-h-[70vh]">
          <Table emptyText="No users found">
            <TableHeader>
              <TableRow>
                <TableHeadCell className="w-16">No.</TableHeadCell>
                <TableHeadCell>First Name</TableHeadCell>
                <TableHeadCell>Middle Name</TableHeadCell>
                <TableHeadCell>Last Name</TableHeadCell>
                <TableHeadCell>Suffix</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Gender</TableHeadCell>
                <TableHeadCell>Address</TableHeadCell>
                <TableHeadCell className="text-right w-32">Actions</TableHeadCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.middleName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.suffix}</TableCell>
                  <TableCell className="font-semibold">{user.name}</TableCell>
                  <TableCell>{user.gender ? user.gender.name : 'Unknown'}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(user.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {showModal === "create" && (
        <ModalOverlay title="Add New User" onConfirm={saveUser}>
          <div className="space-y-4">
            <FloatingLabelInput
              label="First Name *"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <FloatingLabelInput
              label="Middle Name"
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              label="Last Name *"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <FloatingLabelInput
              label="Suffix"
              type="text"
              name="suffix"
              value={formData.suffix}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              label="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <FloatingLabelSelect
              label="Gender *"
              name="genderId"
              value={String(formData.genderId)}
              onChange={handleInputChange}
            >
              <option value="0">Select Gender</option>
              {genders.map((gender) => (
                <option key={gender.id} value={String(gender.id)}>
                  {gender.name}
                </option>
              ))}
            </FloatingLabelSelect>
            <FloatingLabelInput
              label="Date of Birth (yyyy-mm-dd)"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              label="Gmail *"
              type="email"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <FloatingLabelInput
              label="Password *"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!editingUser}
              showPasswordToggle={true}
            />
            <FloatingLabelInput
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              showPasswordToggle={true}
            />
            <FloatingLabelInput
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </FloatingLabelInput>
          </div>
        </ModalOverlay>
      )}

      {showModal === "edit" && editingUser && (
        <ModalOverlay title="Edit User" onConfirm={saveUser}>
          <div className="space-y-4">
            {/* Same form fields as create */}
            <FloatingLabelInput
              label="First Name *"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <FloatingLabelInput
              label="Middle Name"
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              label="Last Name *"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <FloatingLabelInput
              label="Suffix"
              type="text"
              name="suffix"
              value={formData.suffix}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              label="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <FloatingLabelSelect
              label="Gender *"
              name="genderId"
              value={String(formData.genderId)}
              onChange={handleInputChange}
            >
              <option value="0">Select Gender</option>
              {genders.map((gender) => (
                <option key={gender.id} value={String(gender.id)}>
                  {gender.name}
                </option>
              ))}
            </FloatingLabelSelect>
            <FloatingLabelInput
              label="Date of Birth (yyyy-mm-dd)"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              label="Username *"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <FloatingLabelInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              showPasswordToggle={true}
              placeholder="Leave blank to keep current"
            />
            <FloatingLabelInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              showPasswordToggle={true}
            />
            <FloatingLabelInput
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </FloatingLabelInput>
          </div>
        </ModalOverlay>
      )}

      {showModal === "delete" && deleteConfirmId !== null && (
        <ModalOverlay title="Delete User?" onConfirm={deleteUser} confirmText="Delete">
          Are you sure you want to delete this user? This action cannot be undone.
        </ModalOverlay>
      )}
    </>
  );
};

export default UserPage;
