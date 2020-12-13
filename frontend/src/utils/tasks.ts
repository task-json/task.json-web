import { TodoTxtItem } from "jstodotxt";

export function parseTasks(tasks: string[]) {
  return tasks.map(task => {
    let item = new TodoTxtItem(task)
    if (item.projects === null)
      item.projects = [];
    if (item.contexts === null)
      item.contexts = [];
    return item;
  });
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
    task.contexts?.forEach(ctx => {
      contexts.add(ctx);
    });
    return contexts;
  }, new Set());
}
