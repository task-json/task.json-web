import { TodoTxtItem } from "jstodotxt";

export function parseTasks(tasks: string[]) {
  return tasks.map(task => new TodoTxtItem(task));
}

export function getProjects(tasks: TodoTxtItem[]) {
  return tasks.reduce((projects: Set<string>, task: TodoTxtItem) => {
    task.projects?.forEach(proj => {
      projects.add(proj);
    });
    return projects;
  }, new Set());
}

export function getContexts(tasks: TodoTxtItem[]) {
  return tasks.reduce((contexts: Set<string>, task: TodoTxtItem) => {
    task.projects?.forEach(ctx => {
      contexts.add(ctx);
    });
    return contexts;
  }, new Set());
}
