import { TaskJson, TaskType } from "task.json";

export function getFieldValues(taskJson: TaskJson, field: "projects" | "contexts") {
  const values: Set<string> = new Set();
  const types: TaskType[] = ["todo", "done"];

  for (const type of types) {
    for (const task of taskJson[type]) {
      task[field]?.forEach(value => {
        values.add(value);
      });
    }
  }
  return values;
}
