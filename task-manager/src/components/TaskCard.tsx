"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types";
import Timer from "./Timer";

interface TaskCardProps {
  task: Task;
  index: number;
  onToggleComplete: (taskId: string) => void;
  onTimerToggle: (taskId: string) => void;
  onTimerStop: (taskId: string, seconds: number) => void;
  onTimerReset: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  isTimerRunning?: boolean;
  isCompleted?: boolean;
}

// Priority → left sidebar color
const priorityColors: Record<Task["priority"], string> = {
  High: "bg-red-500",
  Medium: "bg-orange-400",
  Low: "bg-yellow-400",
};

// Tag → badge color
const tagColors: Record<Task["tag"], string> = {
  Work: "bg-blue-100 text-blue-700",
  Personal: "bg-purple-100 text-purple-700",
  Projects: "bg-green-100 text-green-700",
};

function formatEstimate(minutes: number): string {
  if (minutes >= 60) {
    return minutes === 90 ? "90+ min" : `${minutes / 60}h`;
  }
  return `${minutes} min`;
}

function getDueDateStatus(dueDate?: string): "overdue" | "today" | "upcoming" | null {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  return "upcoming";
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TaskCard({
  task,
  index,
  onToggleComplete,
  onTimerToggle,
  onTimerStop,
  onTimerReset,
  onEdit,
  isTimerRunning = false,
  isCompleted = false,
}: TaskCardProps) {
  const dueDateStatus = getDueDateStatus(task.dueDate);

  const dueDateColors = {
    overdue: "bg-red-100 text-red-700",
    today: "bg-blue-100 text-blue-700",
    upcoming: "bg-green-100 text-green-700",
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative flex overflow-hidden rounded-lg border bg-white shadow-sm transition-opacity ${
            isCompleted ? "opacity-60" : ""
          } ${snapshot.isDragging ? "shadow-lg ring-2 ring-zinc-300" : ""}`}
        >
          {/* Priority color sidebar */}
          <div className={`w-1.5 flex-shrink-0 ${priorityColors[task.priority]}`} />

          <div className="flex-1 p-3">
            {/* Header: checkbox + title */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onToggleComplete(task.id)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
              />
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => onEdit(task.id)}
              >
                <h3
                  className={`text-sm font-medium text-zinc-900 hover:text-zinc-600 ${
                    isCompleted ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata row */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {/* Tag */}
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${tagColors[task.tag]}`}
              >
                {task.tag}
              </span>

              {/* Estimated time */}
              <span className="inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
                {formatEstimate(task.estimatedMinutes)}
              </span>

              {/* Due date */}
              {task.dueDate && dueDateStatus && (
                <span
                  className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${dueDateColors[dueDateStatus]}`}
                >
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>

            {/* Timer row */}
            <div className="mt-2 flex items-center gap-2">
              <Timer
                initialSeconds={task.timeSpentSeconds}
                isRunning={isTimerRunning}
                onToggle={() => onTimerToggle(task.id)}
                onStop={(seconds) => onTimerStop(task.id, seconds)}
                onReset={() => onTimerReset(task.id)}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
