"use client";

import { useState, useEffect, FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Task, Status, Priority, Tag, EstimatedMinutes } from "@/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  initialStatus?: Status;
  editTask?: Task;
}

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
const TAGS: Tag[] = ["Work", "Personal", "Projects"];
const TIME_OPTIONS: EstimatedMinutes[] = [10, 30, 60, 90];

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialStatus = "Queue",
  editTask,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState<EstimatedMinutes>(30);
  const [priority, setPriority] = useState<Priority>("Medium");
  const [tag, setTag] = useState<Tag>("Personal");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditMode = !!editTask;

  // Reset form when modal opens/closes or editTask changes
  useEffect(() => {
    if (isOpen) {
      if (editTask) {
        setTitle(editTask.title);
        setDescription(editTask.description || "");
        setEstimatedMinutes(editTask.estimatedMinutes);
        setPriority(editTask.priority);
        setTag(editTask.tag);
        setDueDate(editTask.dueDate ? new Date(editTask.dueDate) : null);
      } else {
        setTitle("");
        setDescription("");
        setEstimatedMinutes(30);
        setPriority("Medium");
        setTag("Personal");
        setDueDate(null);
      }
      setError("");
      setShowDeleteConfirm(false);
    }
  }, [isOpen, editTask]);

  const handleDelete = async () => {
    if (!editTask || !onDelete) return;
    setIsSubmitting(true);
    try {
      await onDelete(editTask.id);
    } catch {
      setError("Failed to delete task. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        status: editTask?.status || initialStatus,
        priority,
        tag,
        estimatedMinutes,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        timeSpentSeconds: editTask?.timeSpentSeconds || 0,
        completedAt: editTask?.completedAt,
      });
      onClose();
    } catch {
      setError("Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4">
        {/* Header with title and delete button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            {isEditMode ? "Edit Task" : "Create Task"}
          </h2>
          {isEditMode && onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete task"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800 mb-3">
              Delete this task? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 rounded px-3 py-1.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 rounded px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes or details..."
              rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-none"
            />
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Estimated Time
            </label>
            <div className="flex gap-2">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setEstimatedMinutes(time)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    estimatedMinutes === time
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {time === 90 ? "90+" : time} min
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-zinc-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Tag
            </label>
            <div className="flex gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    tag === t
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date - Calendar Picker */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Due Date
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              dateFormat="MMM d, yyyy"
              placeholderText="Select a date"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              calendarClassName="shadow-lg"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              isClearable
              todayButton="Today"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-400"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
