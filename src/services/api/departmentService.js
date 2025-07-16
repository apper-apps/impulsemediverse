import departmentsData from "@/services/mockData/departments.json";

const STORAGE_KEY = "mediverse_departments";

// Initialize local storage with mock data if not exists
const initializeData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departmentsData));
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const departmentService = {
  async getAll() {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return [...data];
  },

  async getById(id) {
    await delay(200);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.find(dept => dept.Id === parseInt(id));
  },

  async create(department) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const newId = Math.max(...data.map(d => d.Id)) + 1;
    const newDepartment = { ...department, Id: newId };
    data.push(newDepartment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ...newDepartment };
  },

  async update(id, updates) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const index = data.findIndex(dept => dept.Id === parseInt(id));
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { ...data[index] };
    }
    throw new Error("Department not found");
  },

  async delete(id) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const filteredData = data.filter(dept => dept.Id !== parseInt(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return true;
  }
};