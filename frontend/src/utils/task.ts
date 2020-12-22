import { Task } from "../types";
import { format } from "date-fns";

export const initTask = () => ({
	text: "",
	priority: "",
	done: false,
	contexts: [],
  projects: [],
  due: null,
	start: format(new Date(), "yyyy-MM-dd"),
	end: null
} as Task);

export function getProjects(tasks: Task[]) {
  return tasks.reduce((projects: Set<string>, task: Task) => {
    task.projects.forEach(proj => {
      projects.add(proj);
    });
    return projects;
  }, new Set());
}

export function getContexts(tasks: Task[]) {
  return tasks.reduce((contexts: Set<string>, task: Task) => {
    task.contexts.forEach(ctx => {
      contexts.add(ctx);
    });
    return contexts;
  }, new Set());
}

