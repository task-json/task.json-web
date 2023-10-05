import { Task } from "task.json";

export function normalizeTask(task: Task) {
  return {
    ...task,
    priority: task.priority?.length ? task.priority : undefined,
    projects: task.projects?.length ? task.projects : undefined,
    contexts: task.contexts?.length ? task.contexts : undefined
  }
}
