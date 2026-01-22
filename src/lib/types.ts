export interface Planner {
  id: string;
  email: string;
  fullName: string;
}

export interface Client {
  id: string;
  partner1: string;
  partner2: string;
  weddingDate: string; // YYYY-MM-DD
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  category: string;
}

export interface Wedding {
  id: string;
  clientName: string; // "Sarah & James"
  date: string;
  venue: string;
  daysToGo: number;
}
