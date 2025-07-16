import healthTrendsData from "@/services/mockData/healthTrends.json";

const STORAGE_KEY = "mediverse_health_trends";

// Initialize local storage with mock data if not exists
const initializeData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(healthTrendsData));
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const healthTrendsService = {
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
    return data.find(trend => trend.Id === parseInt(id));
  },

  async getByPatientId(patientId) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.filter(trend => trend.patientId === patientId);
  },

  async getByMetric(metric) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.filter(trend => trend.metric === metric);
  },

  async getByCategory(category) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data.filter(trend => trend.category === category);
  },

  async create(trend) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const newId = Math.max(...data.map(t => t.Id)) + 1;
    const newTrend = { ...trend, Id: newId };
    data.push(newTrend);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ...newTrend };
  },

  async update(id, updates) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const index = data.findIndex(trend => trend.Id === parseInt(id));
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { ...data[index] };
    }
    throw new Error("Health trend not found");
  },

  async delete(id) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const filteredData = data.filter(trend => trend.Id !== parseInt(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return true;
  },

  async addDataPoint(trendId, dataPoint) {
    await delay(400);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const trend = data.find(t => t.Id === parseInt(trendId));
    if (trend) {
      trend.data.push({
        ...dataPoint,
        date: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { ...trend };
    }
    throw new Error("Health trend not found");
  }
};