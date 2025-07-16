import consultationsData from "@/services/mockData/consultations.json";

const STORAGE_KEY = "mediverse_consultations";

// Initialize local storage with mock data if not exists
const initializeData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultationsData));
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const consultationService = {
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
    return data.find(consultation => consultation.Id === parseInt(id));
  },

  async getByPatientId(patientId) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.filter(consultation => consultation.patientId === patientId);
  },

  async getByDepartment(departmentId) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.filter(consultation => consultation.departmentId === parseInt(departmentId));
  },

  async create(consultation) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
const newId = Math.max(...data.map(c => c.Id)) + 1;
    const now = new Date().toISOString();
    const newConsultation = { 
      ...consultation, 
      Id: newId,
      timestamp: now,
      createdAt: now,
      status: "active"
    };
    data.push(newConsultation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ...newConsultation };
  },

  async update(id, updates) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const index = data.findIndex(consultation => consultation.Id === parseInt(id));
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { ...data[index] };
    }
    throw new Error("Consultation not found");
  },

  async delete(id) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const filteredData = data.filter(consultation => consultation.Id !== parseInt(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return true;
  },

  async addMessage(consultationId, message) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const consultation = data.find(c => c.Id === parseInt(consultationId));
    if (consultation) {
      const newMessage = {
        id: Date.now(),
        ...message,
        timestamp: new Date().toISOString()
      };
      consultation.messages.push(newMessage);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { ...newMessage };
    }
    throw new Error("Consultation not found");
  }
};