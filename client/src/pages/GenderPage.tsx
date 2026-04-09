import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "../components/Table";
import FloatingLabelInput from "../components/input/FloatingLabelInput";

const API_GENDERS = 'http://localhost:8000/api/genders';

interface Gender {
  id: number;
  name: string;
  status: "active" | "inactive";
}

interface FormData {
  name: string;
  status: "active" | "inactive";
}

const GenderPage = () => {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [editingGender, setEditingGender] = useState<Gender | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    status: "active"
  });

  const fetchGenders = async () => {
    try {
      const { data } = await axios.get(API_GENDERS);
      setGenders(data);
    } catch {
      // Silent fail or toast later
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchGenders();
  }, []);

  const openCreateModal = () => {
    setFormData({ name: "", status: "active" });
    setEditingGender(null);
    setShowModal("create");
  };

  const openEditModal = (gender: Gender) => {
    setFormData({ name: gender.name, status: gender.status });
    setEditingGender(gender);
    setShowModal("edit");
  };

  const openDeleteModal = (id: number) => {
    setDeleteConfirmId(id);
    setShowModal("delete");
  };

  const closeModal = () => {
    setShowModal(null);
    setEditingGender(null);
    setDeleteConfirmId(null);
  };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof FormData]: value as "active" | "inactive" }));
  };


  const saveGender = async () => {
    if (!formData.name.trim()) {
      alert('Please enter gender name'); // Temp, improve later
      return;
    }

    const payload = { name: formData.name.trim(), status: formData.status };

    try {
      if (editingGender) {
        await axios.put(`${API_GENDERS}/${editingGender.id}`, payload);
      } else {
        await axios.post(API_GENDERS, payload);
      }
      closeModal();
      fetchGenders();
    } catch {
      alert('Failed to save gender');
    }


  };

  const deleteGender = async () => {
    if (deleteConfirmId) {
      try {
        await axios.delete(`${API_GENDERS}/${deleteConfirmId}`);
        closeModal();
        fetchGenders();
      } catch {
        alert('Failed to delete gender');
      }

    }
  };

  const toggleStatus = async (id: number) => {
    const gender = genders.find(g => g.id === id);
    if (!gender) return;

    const newStatus = gender.status === "active" ? "inactive" : "active";
    try {
      await axios.patch(`${API_GENDERS}/${id}`, { status: newStatus });
      fetchGenders();
    } catch {
      alert('Failed to update status');
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
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
          <h1 className="text-3xl font-bold text-gray-900">Genders</h1>
          <button 
            onClick={openCreateModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            + Add Gender
          </button>
        </div>

        <div className="bg-white shadow-xl ring-1 ring-gray-900/5 rounded-xl overflow-hidden max-h-[70vh]">
          <Table emptyText="No genders found">
            <TableHeader>
              <TableRow>
                <TableHeadCell className="w-20">ID</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell className="w-32">Status</TableHeadCell>
                <TableHeadCell className="text-right w-40">Actions</TableHeadCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {genders.map((gender) => (
                <TableRow key={gender.id}>
                  <TableCell>{gender.id}</TableCell>
                  <TableCell className="font-medium">{gender.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      gender.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {gender.status.charAt(0).toUpperCase() + gender.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button
                      onClick={() => toggleStatus(gender.id)}
                      className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition"
                      title="Toggle Status"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openEditModal(gender)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(gender.id)}
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
        <ModalOverlay title="Add New Gender" onConfirm={saveGender}>
          <div className="space-y-4">
            <FloatingLabelInput
              label="Name *"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                name="status" 
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </ModalOverlay>
      )}

      {showModal === "edit" && editingGender && (
        <ModalOverlay title="Edit Gender" onConfirm={saveGender}>
          <div className="space-y-4">
            <FloatingLabelInput
              label="Name *"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                name="status" 
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </ModalOverlay>
      )}

      {showModal === "delete" && deleteConfirmId !== null && (
        <ModalOverlay title="Delete Gender?" onConfirm={deleteGender} confirmText="Delete">
          Are you sure you want to delete this gender? This action cannot be undone.
        </ModalOverlay>
      )}
    </>
  );
};

export default GenderPage;

