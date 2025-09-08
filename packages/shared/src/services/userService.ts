// Simplified user service - from complex class to simple functions
import type { User } from "@/types/entities";

// Mock data for demo purposes
const mockUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  { id: 4, name: "Alice Brown", email: "alice@example.com" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com" },
];

// Simple user service with demo data
export const userService = {
  async getUsers() {
    try {
      // Demo data - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      return {
        success: true,
        message: "Users retrieved successfully",
        data: mockUsers,
      };

      // In real app:
      // return api.get<User[]>('/users')
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch users",
      );
    }
  },

  async getUserById(id: number | string) {
    try {
      // Demo data - find user by ID
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = mockUsers.find((u) => u.id === Number(id));
      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        message: "User retrieved successfully",
        data: user,
      };

      // In real app:
      // return api.get<User>(`/users/${id}`)
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user",
      );
    }
  },

  async createUser(userData: Omit<User, "id">) {
    try {
      // Demo - create new user with mock ID
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newUser = {
        id: Math.max(...mockUsers.map((u) => u.id)) + 1,
        ...userData,
      };

      mockUsers.push(newUser);

      return {
        success: true,
        message: "User created successfully",
        data: newUser,
      };

      // In real app:
      // return api.post<User>('/users', userData)
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create user",
      );
    }
  },

  async updateUser(id: number | string, updates: Partial<User>) {
    try {
      // Demo - update user in mock data
      await new Promise((resolve) => setTimeout(resolve, 600));

      const userIndex = mockUsers.findIndex((u) => u.id === Number(id));
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };

      return {
        success: true,
        message: "User updated successfully",
        data: mockUsers[userIndex],
      };

      // In real app:
      // return api.put<User>(`/users/${id}`, updates)
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update user",
      );
    }
  },

  async deleteUser(id: number | string) {
    try {
      // Demo - remove user from mock data
      await new Promise((resolve) => setTimeout(resolve, 400));

      const userIndex = mockUsers.findIndex((u) => u.id === Number(id));
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      mockUsers.splice(userIndex, 1);

      return {
        success: true,
        message: "User deleted successfully",
        data: null,
      };

      // In real app:
      // return api.delete(`/users/${id}`)
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    }
  },
};
