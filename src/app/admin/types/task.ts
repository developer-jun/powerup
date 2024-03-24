export type Task = {
  id: number;
  text: string;
  done: boolean;
}

export type Tasks = {
  tasks: Task[];
  dispatch: React.Dispatch<any>;
}