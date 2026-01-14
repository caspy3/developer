"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Task, Status } from "@/types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  status: Status;
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onTimerToggle: (taskId: string) => void;
  onTimerStop: (taskId: string, seconds: number) => void;
  onTimerReset: (taskId: string) => void;
  onAddTask: (status: Status) => void;
  onEditTask: (taskId: string) => void;
  activeTimerTaskId?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function formatTotalTime(tasks: Task[]): string {
  const totalMinutes = tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}

export default function Column({
  status,
  tasks,
  onToggleComplete,
  onTimerToggle,
  onTimerStop,
  onTimerReset,
  onAddTask,
  onEditTask,
  activeTimerTaskId,
  isCollapsed = false,
  onToggleCollapse,
}: ColumnProps) {
  const isCompletedColumn = status === "Completed";
  const totalTime = formatTotalTime(tasks);
  const taskCount = tasks.length;

  // Collapsed state for Completed column
  if (isCompletedColumn && isCollapsed) {
    return (
      <div
        onClick={onToggleCollapse}
        className="flex h-full w-10 cursor-pointer flex-col items-center rounded-lg border border-zinc-200 bg-zinc-50 py-4 transition-colors hover:bg-zinc-100"
      >
        <span className="text-xs font-medium text-zinc-500 [writing-mode:vertical-lr] rotate-180">
          Completed ({taskCount})
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-72 flex-shrink-0 flex-col rounded-lg border border-zinc-200 bg-zinc-50">
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-900">{status}</h2>
          <span className="text-xs text-zinc-500">
            {totalTime}, {taskCount} {taskCount === 1 ? "task" : "tasks"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isCompletedColumn && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
              title="Collapse"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          )}
          {!isCompletedColumn && (
            <button
              onClick={() => onAddTask(status)}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
              title="Add task"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Task list */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 overflow-y-auto p-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-zinc-100" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onToggleComplete={onToggleComplete}
                onTimerToggle={onTimerToggle}
                onTimerStop={onTimerStop}
                onTimerReset={onTimerReset}
                onEdit={onEditTask}
                isTimerRunning={activeTimerTaskId === task.id}
                isCompleted={status === "Completed"}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="py-8 text-center text-sm text-zinc-400">No tasks</p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
