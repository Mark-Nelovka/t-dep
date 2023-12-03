export class TodoEntity {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  completed: boolean;
  countTodos?: number;
  createdAt?: string;
  updateAt?: string;
}
