import { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import FloatingLabelInput from "../components/input/FloatingLabelInput";
import FloatingLabelSelect from "../components/Select/FloatingLabelSelect";
// sampleUsersData moved to mockData.ts
import GenderPage from "../pages/GenderPage";
import UserPage from "../pages/UserPage";

const SampleComponent = () => {
    const [firstName, setFirstName] = useState("john");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");

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

            {/* Users Link - Full CRUD at /users */}
            <div className="w-full">
                <Link
                    to="/users"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1 transition-all duration-300 group"
                >
                    <svg className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    View Users - Full CRUD with Modals
                </Link>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<GenderPage />} />
                <Route path="/users" element={<UserPage />} />
                <Route path="/genders" element={<GenderPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;