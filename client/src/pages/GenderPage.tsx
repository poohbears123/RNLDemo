import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "../components/Table";

interface Gender {
  id: number;
  name: string;
  status: "active" | "inactive";
}

const GenderPage = () => {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newGender, setNewGender] = useState(""); 

useEffect(() => {
    const saved = localStorage.getItem('gendersData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Gender[];
        setGenders(parsed);
      } catch {
        // invalid, use empty
      }
    } else {
      // initial sample if no saved
      const sample: Gender[] = [
        { id: 1, name: "Male", status: "active" },
        { id: 2, name: "Female", status: "active" },
        { id: 3, name: "Other", status: "inactive" }
      ];
      setGenders(sample);
      localStorage.setItem('gendersData', JSON.stringify(sample));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('gendersData', JSON.stringify(genders));
  }, [genders]);

  const addGender = () => {
    if (newGender.trim()) {
      const maxId = Math.max(...genders.map(g => g.id), 0);
      const newG: Gender = { id: maxId + 1, name: newGender.trim(), status: "active" as const };
      setGenders([...genders, newG]);
      setNewGender("");
      setShowAdd(false);
    }
  };

  const deleteGender = (id: number) => {
    if (confirm("Delete?")) {
      setGenders(genders.filter(g => g.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setGenders(genders.map(g => g.id === id ? { ...g, status: g.status === "active" ? "inactive" : "active" } : g));
  };

  const editName = (id: number) => {
    const gender = genders.find(g => g.id === id);
    if (!gender) return;
    const newName = prompt("Edit name:", gender.name);
    if (newName !== null && newName.trim()) {
      setGenders(genders.map(g => g.id === id ? {...g, name: newName.trim()} : g));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Genders</h1>
<button 
          onClick={() => setShowAdd(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50"
          disabled={!isLoaded}
        >
          + Add Gender
        </button>
      </div>

      {showAdd && isLoaded && (
        <div className="mb-6 p-6 bg-white shadow-lg rounded-xl border">
          <div className="flex gap-3">
            <input
              type="text"
              value={newGender}
              onChange={(e) => setNewGender(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Gender name"
            />
            <button onClick={addGender} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add
            </button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}
      {!isLoaded && (
        <div className="mb-6 p-6 bg-white shadow-lg rounded-xl border text-center text-gray-500">
          Loading...
        </div>
      )}

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
                    onClick={() => editName(gender.id)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteGender(gender.id)}
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
  );
};

export default GenderPage;

