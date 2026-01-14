import { NextRequest, NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/airtable";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const task = await updateTask(id, {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      tag: body.tag,
      estimatedMinutes: body.estimatedMinutes,
      dueDate: body.dueDate,
      timeSpentSeconds: body.timeSpentSeconds,
      completedAt: body.completedAt,
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
