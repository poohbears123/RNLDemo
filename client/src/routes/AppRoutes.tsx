import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import FloatingLabelInput from "../components/input/FloatingLabelInput";
import FloatingLabelSelect from "../components/Select/FloatingLabelSelect";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell, sampleUsersData } from "../components/Table";
import GenderPage from "../pages/GenderPage";

const SampleComponent = () => {
    const [firstName, setFirstName] = useState("john");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [showEmpty, setShowEmpty] = useState(false);

    const genders = [
        { value: "", text: "Select Gender" },
        { value: "1", text: "Male" },
        { value: "2", text: "Female" },
        { value: "3", text: "Prefer Not to Say" }
    ];

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                RNL Demo - Forms & Enhanced Table
            </h1>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div>
                    <FloatingLabelInput
                        label="First Name"
                        type="text"
                        name="first_name"
                        required
                        autoFocus
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <p className="mt-1 text-gray-700 font-medium">First Name: {firstName}</p>
                </div>

                <div>
                    <FloatingLabelInput
                        label="Last Name"
                        type="text"
                        name="last_name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <p className="mt-1 text-gray-700 font-medium">Last Name: {lastName}</p>
                </div>

                <div>
                    <FloatingLabelInput
                        label=""
                        type="date"
                        name="birth_date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                    <p className="mt-1 text-gray-700 font-medium">Birth Date: {birthDate}</p>
                </div>

                <div>
                    <FloatingLabelSelect
                        label=""
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        {genders.map((genderOption, index) => (
                            <option key={index} value={genderOption.value}>
                                {genderOption.text}
                            </option>
                        ))}
                    </FloatingLabelSelect>
                    <p className="mt-1 text-gray-700 font-medium">Gender: {gender}</p>
                </div>

                <div className="md:col-span-2">
                    <FloatingLabelInput
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPasswordToggle={true}
                        error={
                            password.length > 0 && password.length < 6
                                ? "Password must be at least 6 characters"
                                : ""
                        }
                    />
                    <p className="mt-1 text-gray-700 font-medium">Password: {password}</p>
                </div>
            </div>

            {/* Users Table */}
            <div className="w-full">
                <Table
                    emptyText="No users found"
                    className="shadow-xl ring-1 ring-gray-900/5 rounded-xl max-h-[70vh] overflow-hidden"
                >
                    <TableHeader>
                        <TableRow>
                            <TableHeadCell className="w-20">ID</TableHeadCell>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Role</TableHeadCell>
                            <TableHeadCell className="text-right">Status</TableHeadCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {showEmpty
                            ? null
                            : sampleUsersData.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell className="font-semibold">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="capitalize">{user.role}</TableCell>
                                    <TableCell className="text-right">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<GenderPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;