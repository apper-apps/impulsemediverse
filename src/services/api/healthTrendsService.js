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
  },

  async getForecast(trendId, periods = 3) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const trend = data.find(t => t.Id === parseInt(trendId));
    
    if (!trend || trend.data.length < 4) {
      throw new Error("Insufficient data for forecasting");
    }
    
    const values = trend.data.map(d => d.value);
    const n = values.length;
    
    // Linear regression for forecasting
    const xValues = Array.from({length: n}, (_, i) => i);
    const xMean = xValues.reduce((a, b) => a + b) / n;
    const yMean = values.reduce((a, b) => a + b) / n;
    
    const slope = xValues.reduce((sum, x, i) => sum + (x - xMean) * (values[i] - yMean), 0) /
                  xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
    
    const intercept = yMean - slope * xMean;
    
    // Generate forecast
    const forecast = [];
    for (let i = 1; i <= periods; i++) {
      const forecastValue = intercept + slope * (n - 1 + i);
      const futureDate = new Date(trend.data[trend.data.length - 1].date);
      futureDate.setMonth(futureDate.getMonth() + i);
      
      forecast.push({
        date: futureDate.toISOString().split('T')[0],
        value: Math.max(0, forecastValue),
        type: 'forecast'
      });
    }
    
    // Calculate confidence
    const residuals = values.map((val, i) => val - (intercept + slope * i));
    const mse = residuals.reduce((sum, r) => sum + r * r, 0) / n;
    const confidence = Math.max(60, Math.min(95, 100 - Math.sqrt(mse)));
    
    return {
      trendId: parseInt(trendId),
      forecast,
      confidence: confidence.toFixed(0),
      trend: slope > 0 ? "increasing" : "decreasing",
      strength: Math.abs(slope) > 1 ? "strong" : "moderate"
    };
  },

  async getMultipleForecast(trendIds, periods = 3) {
    await delay(400);
    const forecasts = [];
    
    for (const trendId of trendIds) {
      try {
        const forecast = await this.getForecast(trendId, periods);
        forecasts.push(forecast);
      } catch (error) {
        forecasts.push({
          trendId: parseInt(trendId),
          error: error.message
        });
      }
    }
    
    return forecasts;
  },

  async getAnalytics(trendId) {
    await delay(300);
    initializeData();
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const trend = data.find(t => t.Id === parseInt(trendId));
    
    if (!trend) {
      throw new Error("Health trend not found");
    }
    
    const values = trend.data.map(d => d.value);
    const n = values.length;
    
    if (n < 2) {
      return {
        mean: 0,
        variance: 0,
        trend: "insufficient_data",
        volatility: 0
      };
    }
    
    const mean = values.reduce((a, b) => a + b) / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const volatility = Math.sqrt(variance);
    
    // Calculate trend
    const firstHalf = values.slice(0, Math.floor(n/2));
    const secondHalf = values.slice(Math.floor(n/2));
    const firstMean = firstHalf.reduce((a, b) => a + b) / firstHalf.length;
    const secondMean = secondHalf.reduce((a, b) => a + b) / secondHalf.length;
    
    const trendDirection = secondMean > firstMean ? "increasing" : 
                          secondMean < firstMean ? "decreasing" : "stable";
    
    return {
      mean: mean.toFixed(2),
      variance: variance.toFixed(2),
      trend: trendDirection,
      volatility: volatility.toFixed(2),
      dataPoints: n,
      latest: values[n-1],
      change: n > 1 ? ((values[n-1] - values[n-2]) / values[n-2] * 100).toFixed(1) : 0
    };
  }
};