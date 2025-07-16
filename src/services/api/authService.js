// Mock user data following Id convention
const mockUsers = [
  {
    Id: 1,
    email: 'doctor@mediverse.com',
    password: 'password123',
    name: 'Dr. Sarah Johnson',
    role: 'Doctor',
    department: 'Cardiology',
    avatar: null,
    createdAt: '2023-01-15T10:30:00Z'
  },
  {
    Id: 2,
    email: 'admin@mediverse.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin',
    department: 'Administration',
    avatar: null,
    createdAt: '2023-01-10T09:00:00Z'
  }
];

let currentUserId = 2;

// Simulate JWT token generation
const generateToken = (user) => {
  return btoa(JSON.stringify({ 
    userId: user.Id, 
    email: user.email, 
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }));
};

// Simulate token validation
const validateToken = (token) => {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.exp > Date.now() ? decoded : null;
  } catch {
    return null;
  }
};

// Authentication service functions
export const authService = {
  // Login user
  async login(credentials) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const { email, password } = credentials;
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    };
  },

  // Register new user
  async register(userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { email, password, name, role = 'Patient', department = 'General' } = userData;
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser = {
      Id: ++currentUserId,
      email,
      password,
      name,
      role,
      department,
      avatar: null,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token,
      message: 'Registration successful'
    };
  },

  // Logout user
  async logout() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { message: 'Logged out successfully' };
  },

  // Get current user from token
  async getCurrentUser(token) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const decoded = validateToken(token);
    if (!decoded) {
      throw new Error('Invalid or expired token');
    }
    
    const user = mockUsers.find(u => u.Id === decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Refresh token
  async refreshToken(token) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const decoded = validateToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }
    
    const user = mockUsers.find(u => u.Id === decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const newToken = generateToken(user);
    return { token: newToken };
  },

  // Update user profile
  async updateProfile(userId, updates) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = mockUsers.findIndex(u => u.Id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Don't allow password updates through this endpoint
    const { password, ...allowedUpdates } = updates;
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...allowedUpdates
    };
    
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  }
};

export default authService;