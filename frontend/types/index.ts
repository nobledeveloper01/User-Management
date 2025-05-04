export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  joined?: string;
  role: string;
  status: string;
  profilePhoto?: string;
}

export interface UserConnection {
  users: User[];
  totalPages: number;
  currentPage: number;
  nodes: number;
  totalCount: number;
}