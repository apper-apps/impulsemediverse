import medicalRecordsData from "@/services/mockData/medicalRecords.json";

const STORAGE_KEY = "mediverse_medical_records";

// Initialize local storage with mock data if not exists
const initializeData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicalRecordsData));
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const medicalRecordService = {
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
    return data.find(record => record.Id === parseInt(id));
  },

  async getByPatientId(patientId) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.filter(record => record.patientId === patientId);
  },

  async getByCategory(category) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.filter(record => record.category === category);
  },

  async create(record) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const newId = Math.max(...data.map(r => r.Id)) + 1;
    const newRecord = { 
      ...record, 
      Id: newId,
      uploadDate: new Date().toISOString()
    };
    data.push(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ...newRecord };
  },

  async update(id, updates) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const index = data.findIndex(record => record.Id === parseInt(id));
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { ...data[index] };
    }
    throw new Error("Medical record not found");
  },

  async delete(id) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const filteredData = data.filter(record => record.Id !== parseInt(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return true;
  },

  async uploadFile(file, patientId, department = "General Practitioner") {
    await delay(1000); // Simulate file upload time
    
    // Simulate file parsing
    const parsedData = {
      type: file.type.includes("image") ? "image" : "document",
      size: file.size,
      processed: true,
      results: "AI analysis results would appear here based on file content."
    };

    const category = file.name.toLowerCase().includes("blood") ? "Lab Results" :
                    file.name.toLowerCase().includes("ecg") ? "Cardiac Tests" :
                    file.name.toLowerCase().includes("xray") ? "Imaging" :
                    file.name.toLowerCase().includes("prescription") ? "Medications" : "General";

    const newRecord = {
      patientId,
      fileName: file.name,
      fileType: file.type,
      department,
      category,
      parsedData
    };

    return this.create(newRecord);
  }
};