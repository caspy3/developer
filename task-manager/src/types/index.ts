export type Status = "Queue" | "Today" | "Waiting" | "Completed";
export type Priority = "High" | "Medium" | "Low";
export type Tag = "Work" | "Personal" | "Projects";
export type EstimatedMinutes = 10 | 30 | 60 | 90;

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  tag: Tag;
  estimatedMinutes: EstimatedMinutes;
  dueDate?: string; // ISO date string
  timeSpentSeconds: number;
  createdAt: string;
  completedAt?: string;
}
