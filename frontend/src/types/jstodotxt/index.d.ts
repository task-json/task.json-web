declare module "jstodotxt" {
	export declare class TodoTxtExtension {
		constructor(name: string?);
		parsingFunction(line: string);
	};

	export declare class TodoTxtItem {
		text: string;
		priority: string;
		complete: boolean;
		completed: Date;
		date: Date;
		contexts: string[];
		projects: string[];

		constructor(text: string?, extensions: TodoTxtExtension[]?);
		toString(): string;
		parse(text: string?): void;
	};

	export type TodoTxt = {
		parse(textBlock: string?): TodoTxtItem[];
		parseLine(text: string?): TodoTxtItem;
		render(items: TodoTxtItem[]): string;
		renderItem(item: TodoTxtItem): string;
	};
}
