import { TodoEntity } from './entities/todo.entity';

export type Success = {
  statusCode: number;
  message: string;
  data: {
    todos: TodoEntity[];
    page: number;
    countTodos: number;
  };
};

export type Error = {
  statusCode: number;
  message: string;
  data: null;
};
