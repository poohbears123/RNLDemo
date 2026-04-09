export const sampleGendersData = [
  { id: 1, name: "Male", status: "active" },
  { id: 2, name: "Female", status: "active" },
  { id: 3, name: "Other", status: "inactive" }
];

export interface User {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  name: string;
  genderId: number;
  gender: string;
  address: string;
  dob: string;
  username: string;
  password: string;
  status: "Active" | "Inactive";
}

export const sampleUsersData: User[] = [
  { 
    id: 1, 
    firstName: "John", 
    middleName: "", 
    lastName: "Doe", 
    suffix: "Jr", 
    name: "John Doe Jr", 
    genderId: 1, 
    gender: "Male", 
    address: "123 Main St",
    dob: "01/01/1990", 
    username: "johndoe", 
    password: "password123", 
    status: "Active" 
  },
  { 
    id: 2, 
    firstName: "Jane", 
    middleName: "", 
    lastName: "Smith", 
    suffix: "", 
    name: "Jane Smith", 
    genderId: 2, 
    gender: "Female", 
    address: "456 Oak Ave", 
    dob: "15/05/1985", 
    username: "janesmith", 
    password: "password456", 
    status: "Inactive" 
  },
  { 
    id: 3, 
    firstName: "Bob", 
    middleName: "Lee", 
    lastName: "Johnson", 
    suffix: "Sr", 
    name: "Bob Lee Johnson Sr", 
    genderId: 1, 
    gender: "Male", 
    address: "789 Pine Rd", 
    dob: "30/12/1978", 
    username: "bobjohnson", 
    password: "password789", 
    status: "Active" 
  },
];

