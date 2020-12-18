import { Task } from "../types";
import { format } from "date-fns";

// Index
export const DONE = 0;
export const PRI = 1;
export const TEXT = 2;
export const PROJ = 3;
export const CTX = 4;
export const START = 5;
export const END = 6;

export const initTask = () => ([
	false,
	"",
	"",
	[],
	[],
	format(new Date(), "yyyy-MM-dd"),
	null
] as Task);

export function getProjects(tasks: Task[]) {
  return tasks.reduce((projects: Set<string>, task: Task) => {
    task[PROJ].forEach(proj => {
      projects.add(proj);
    });
    return projects;
  }, new Set());
};

export function getContexts(tasks: Task[]) {
  return tasks.reduce((contexts: Set<string>, task: Task) => {
    task[CTX].forEach(ctx => {
      contexts.add(ctx);
    });
    return contexts;
  }, new Set());
};
