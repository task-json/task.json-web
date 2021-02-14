import { TaskJson, Task, TaskType } from "task.json";
import { v4 as uuidv4 } from "uuid";

export const initTask = (): Task => ({
  uuid: uuidv4(),
	text: "",
  start: new Date().toISOString(),
  modified: new Date().toISOString()
});

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
