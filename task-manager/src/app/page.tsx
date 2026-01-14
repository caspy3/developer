"use client";

import { useState, useEffect, useCallback } from "react";
import PasswordGate from "@/components/PasswordGate";
import Board from "@/components/Board";
import TaskModal from "@/components/TaskModal";
import { Task, Status } from "@/types";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | undefined>();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<Status>("Queue");
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Check auth state on mount
  useEffect(() => {
    const authState = sessionStorage.getItem("isAuthenticated");
    setIsAuthenticated(authState === "true");
  }, []);

  // Fetch tasks from Airtable
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      } else {
        setError(data.error || "Failed to fetch tasks");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tasks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isCompleting = task.status !== "Completed";
    const updates = {
      status: isCompleting ? "Completed" : "Queue",
      completedAt: isCompleting ? new Date().toISOString() : null,
    };

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: updates.status as Status, completedAt: updates.completedAt || undefined }
          : t
      )
    );

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!data.success) {
        fetchTasks();
      }
    } catch {
      fetchTasks();
    }
  };

  // Save time to Airtable
  const saveTimeToAirtable = useCallback(async (taskId: string, seconds: number) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeSpentSeconds: seconds }),
      });
    } catch {
      // Silent fail - time will be saved on next sync
    }
  }, []);

  // Update local time when timer stops
  const handleTimerStop = useCallback((taskId: string, seconds: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, timeSpentSeconds: seconds } : t))
    );
    // Also save to Airtable
    saveTimeToAirtable(taskId, seconds);
  }, [saveTimeToAirtable]);

  // Reset timer to 0
  const handleTimerReset = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, timeSpentSeconds: 0 } : t))
    );
    saveTimeToAirtable(taskId, 0);
  }, [saveTimeToAirtable]);

  const handleTimerToggle = async (taskId: string) => {
    const previousTimerId = activeTimerTaskId;

    // If pausing current timer, save time
    if (activeTimerTaskId === taskId) {
      setActiveTimerTaskId(undefined);
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        saveTimeToAirtable(taskId, task.timeSpentSeconds);
      }
    } else {
      // Starting new timer - save previous timer's time first
      if (previousTimerId) {
        const prevTask = tasks.find((t) => t.id === previousTimerId);
        if (prevTask) {
          saveTimeToAirtable(previousTimerId, prevTask.timeSpentSeconds);
        }
      }
      setActiveTimerTaskId(taskId);
    }
  };

  // Move task to a different column (drag & drop)
  const handleMoveTask = async (taskId: string, newStatus: Status) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const updates: { status: Status; completedAt?: string | null } = { status: newStatus };

    // Set or clear completedAt based on new status
    if (newStatus === "Completed") {
      updates.completedAt = new Date().toISOString();
    } else if (task.status === "Completed") {
      updates.completedAt = null;
    }

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus, completedAt: updates.completedAt || undefined }
          : t
      )
    );

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!data.success) {
        fetchTasks(); // Revert on failure
      }
    } catch {
      fetchTasks(); // Revert on failure
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsModalOpen(false);
    setEditingTask(undefined);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.success) {
        fetchTasks(); // Revert on failure
      }
    } catch {
      fetchTasks(); // Revert on failure
    }
  };

  // Open modal to add new task
  const handleAddTask = (status: Status) => {
    setEditingTask(undefined);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  // Open modal to edit existing task
  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };

  // Save task (create or update)
  const handleSaveTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      // Update existing task
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
      );
    } else {
      // Create new task
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      // Add to local state
      setTasks((prev) => [...prev, data.task]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  // Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Password gate
  if (!isAuthenticated) {
    return <PasswordGate onSuccess={handleAuthSuccess} />;
  }

  // Main app
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-zinc-900">Task Manager</h1>
            {activeTimerTaskId && (
              <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-700">
                  Timer: {tasks.find((t) => t.id === activeTimerTaskId)?.title?.slice(0, 20)}
                  {(tasks.find((t) => t.id === activeTimerTaskId)?.title?.length ?? 0) > 20 ? "..." : ""}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={fetchTasks}
            disabled={isLoading}
            className="rounded px-3 py-1 text-sm text-zinc-500 hover:bg-zinc-100 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden p-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button
              onClick={fetchTasks}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}
        {isLoading && tasks.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-zinc-400">
            Loading tasks...
          </div>
        ) : (
          <Board
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onTimerToggle={handleTimerToggle}
            onTimerStop={handleTimerStop}
            onTimerReset={handleTimerReset}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onMoveTask={handleMoveTask}
            activeTimerTaskId={activeTimerTaskId}
          />
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialStatus={modalInitialStatus}
        editTask={editingTask}
      />
    </div>
  );
}
