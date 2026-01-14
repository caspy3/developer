import { NextRequest, NextResponse } from "next/server";
import { getAllTasks, createTask } from "@/lib/airtable";

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const task = await createTask({
      title: body.title,
      description: body.description,
      status: body.status || "Queue",
      priority: body.priority || "Medium",
      tag: body.tag || "Personal",
      estimatedMinutes: body.estimatedMinutes || 30,
      dueDate: body.dueDate,
      timeSpentSeconds: body.timeSpentSeconds || 0,
      completedAt: body.completedAt,
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 }
    );
  }
}
