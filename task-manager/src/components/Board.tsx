"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task, Status } from "@/types";
import Column from "./Column";

interface BoardProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onTimerToggle: (taskId: string) => void;
  onTimerStop: (taskId: string, seconds: number) => void;
  onTimerReset: (taskId: string) => void;
  onAddTask: (status: Status) => void;
  onEditTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: Status) => void;
  activeTimerTaskId?: string;
}

const STATUSES: Status[] = ["Queue", "Today", "Waiting", "Completed"];

// Sort: Priority (High first), then Due Date (soonest first, no date last)
function sortTasks(tasks: Task[]): Task[] {
  const priorityOrder: Record<Task["priority"], number> = {
    High: 0,
    Medium: 1,
    Low: 2,
  };

  return [...tasks].sort((a, b) => {
    // First by priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by due date (no date sorts to end)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return 0;
  });
}

export default function Board({
  tasks,
  onToggleComplete,
  onTimerToggle,
  onTimerStop,
  onTimerReset,
  onAddTask,
  onEditTask,
  onMoveTask,
  activeTimerTaskId,
}: BoardProps) {
  const [completedCollapsed, setCompletedCollapsed] = useState(true);

  // Group and sort tasks by status
  const tasksByStatus: Record<Status, Task[]> = {
    Queue: sortTasks(tasks.filter((t) => t.status === "Queue")),
    Today: sortTasks(tasks.filter((t) => t.status === "Today")),
    Waiting: sortTasks(tasks.filter((t) => t.status === "Waiting")),
    Completed: sortTasks(tasks.filter((t) => t.status === "Completed")),
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    // Dropped outside a column
    if (!destination) return;

    const newStatus = destination.droppableId as Status;
    onMoveTask(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onToggleComplete={onToggleComplete}
            onTimerToggle={onTimerToggle}
            onTimerStop={onTimerStop}
            onTimerReset={onTimerReset}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            activeTimerTaskId={activeTimerTaskId}
            isCollapsed={status === "Completed" && completedCollapsed}
            onToggleCollapse={
              status === "Completed"
                ? () => setCompletedCollapsed(!completedCollapsed)
                : undefined
            }
          />
        ))}
      </div>
    </DragDropContext>
  );
}
