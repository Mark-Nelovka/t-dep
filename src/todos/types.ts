import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entities/todo.entity';

export type Success = {
  statusCode: number;
  message: string;
  data: {
    todos: {
      all?: TodoEntity[];
      completed?: TodoEntity[];
      passed?: TodoEntity[];
    };
    pagination: {
      maxPage: {
        all?: number;
        completed?: number;
        passed?: number;
      };
      page: number;
    };
  };
};

export type Error = {
  statusCode: number;
  message: string;
  data: null;
};

export interface IPropsGet {
  offset: number;
  limit: number;
  page: number;
}

export interface IPropsCreateTodo {
  offset: number;
  limit: number;
  createTodoDto: CreateTodoDto;
  page: number;
}

export interface IPropsUpdateTodoById {
  id: number;
  updateTodoDto: UpdateTodoDto;
  offset: number;
  limit: number;
  page: number;
}


export interface IPropsRemoveTodoById {
  id: number;
  offset: number;
  limit: number;
  page: number;
}
