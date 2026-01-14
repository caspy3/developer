import Airtable from "airtable";
import { Task, Status, Priority, Tag, EstimatedMinutes } from "@/types";

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const table = base(process.env.AIRTABLE_TABLE_NAME || "Tasks");

// Format date for Airtable (YYYY-MM-DD)
function formatDateForAirtable(isoDate: string | undefined): string | undefined {
  if (!isoDate) return undefined;
  // Extract just the date portion from ISO string
  return isoDate.split("T")[0];
}

// Map Airtable record to Task type
function recordToTask(record: Airtable.Record<Airtable.FieldSet>): Task {
  return {
    id: record.id,
    title: record.get("Title") as string,
    description: (record.get("Description") as string) || undefined,
    status: (record.get("Status") as Status) || "Queue",
    priority: (record.get("Priority") as Priority) || "Medium",
    tag: (record.get("Tag") as Tag) || "Personal",
    estimatedMinutes: (record.get("EstimatedMinutes") as EstimatedMinutes) || 30,
    dueDate: (record.get("DueDate") as string) || undefined,
    timeSpentSeconds: (record.get("TimeSpentSeconds") as number) || 0,
    createdAt: record.get("CreatedAt") as string,
    completedAt: (record.get("CompletedAt") as string) || undefined,
  };
}

// Fetch all tasks
export async function getAllTasks(): Promise<Task[]> {
  const records = await table.select().all();
  return records.map(recordToTask);
}

// Create a new task
export async function createTask(
  task: Omit<Task, "id" | "createdAt">
): Promise<Task> {
  const fields: Airtable.FieldSet = {
    Title: task.title,
    Status: task.status,
    Priority: task.priority,
    Tag: task.tag,
    EstimatedMinutes: task.estimatedMinutes,
    TimeSpentSeconds: task.timeSpentSeconds,
  };

  // Only include optional fields if they have values
  if (task.description) fields.Description = task.description;
  if (task.dueDate) fields.DueDate = formatDateForAirtable(task.dueDate);
  if (task.completedAt) fields.CompletedAt = formatDateForAirtable(task.completedAt);

  const record = await table.create(fields);
  return recordToTask(record);
}

// Update an existing task
export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt">>
): Promise<Task> {
  const fields: Airtable.FieldSet = {};

  if (updates.title !== undefined) fields.Title = updates.title;
  if (updates.description !== undefined) fields.Description = updates.description;
  if (updates.status !== undefined) fields.Status = updates.status;
  if (updates.priority !== undefined) fields.Priority = updates.priority;
  if (updates.tag !== undefined) fields.Tag = updates.tag;
  if (updates.estimatedMinutes !== undefined) fields.EstimatedMinutes = updates.estimatedMinutes;
  if (updates.dueDate !== undefined) fields.DueDate = formatDateForAirtable(updates.dueDate) || "";
  if (updates.timeSpentSeconds !== undefined) fields.TimeSpentSeconds = updates.timeSpentSeconds;
  if (updates.completedAt !== undefined) fields.CompletedAt = formatDateForAirtable(updates.completedAt) || "";

  const record = await table.update(id, fields);
  return recordToTask(record);
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  await table.destroy(id);
}
