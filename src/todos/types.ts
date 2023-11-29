import { TodoEntity } from './entities/todo.entity';

export type Success = {
  statusCode: number;
  message: string;
  data: {
    todos: TodoEntity[];
  };
  pagination?: {
    total: number;
  };
};

export type Error = {
  statusCode: number;
  message: string;
  data: null;
};
