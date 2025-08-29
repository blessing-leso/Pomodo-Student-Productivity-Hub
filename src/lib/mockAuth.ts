
// Mock user data for frontend-only auth
export interface MockUser {
  uid: string;
  email: string;
  metadata: {
    creationTime: string;
  };
}

const STORAGE_KEY = 'pomodo_mock_user';

// Get the current mock user from localStorage if it exists
export const getCurrentUser = (): MockUser | null => {
  const userStr = localStorage.getItem(STORAGE_KEY);
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Create mock user signup
export const mockSignup = (email: string, password: string): Promise<MockUser> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const user: MockUser = {
        uid: `user_${Date.now()}`,
        email,
        metadata: {
          creationTime: new Date().toISOString(),
        }
      };
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      resolve(user);
    }, 500);
  });
};

// Mock login
export const mockLogin = (email: string, password: string): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Check if we have this user in localStorage
      const user = getCurrentUser();
      
      if (user && user.email === email) {
        // For demo, any password works for a registered email
        resolve(user);
      } else {
        // Simulate a new login (in real app would reject)
        const newUser: MockUser = {
          uid: `user_${Date.now()}`,
          email,
          metadata: {
            creationTime: new Date().toISOString(),
          }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        resolve(newUser);
      }
    }, 500);
  });
};

// Mock logout
export const mockLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      resolve();
    }, 300);
  });
};
