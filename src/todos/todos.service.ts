import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Success, Error } from './types';
import { TodoModel } from './todo.model';

@Injectable()
export class TodosService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(TodoModel)
    private todoModel: typeof TodoModel,
  ) {}

  async createTodo(createTodoDto: CreateTodoDto): Promise<Success | Error> {
    try {
      await this.todoModel.create({ ...createTodoDto });
      const todos = await this.getAllTodo();

      return {
        statusCode: 201,
        message: 'Todo was created',
        data: { todos: todos.data.todos },
      };
    } catch (err) {
      return {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error ',
        data: null,
      };
    }
  }

  async getAllTodo() {
    try {
      const result = await this.todoModel.findAll({
        order: [['id', 'DESC']],
      });
      // console.log(result);
      return {
        statusCode: 200,
        message: 'All todo',
        data: { todos: result },
      };
    } catch (err) {
      return {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error ',
        data: null,
      };
    }
  }

  async getTodoById(id: number) {
    try {
      const result = await this.todoModel.findOne({
        where: {
          id: id,
        },
      });
      if (!result) {
        throw {
          statusCode: 404,
          message: 'Todo not found',
          data: null,
        };
      }
      return {
        statusCode: 200,
        message: `Todo ${id} was found`,
        data: { todos: result },
      };
    } catch (err) {
      return {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error ',
        data: null,
      };
    }
  }

  async updateTodoById(id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const findTodo = await this.getTodoById(id);
      if (!findTodo.data) {
        throw findTodo;
      }
      await this.todoModel.update(
        { ...updateTodoDto },
        {
          where: {
            id: id,
          },
        },
      );
      const result = await this.getAllTodo();
      // console.log(result);
      return {
        statusCode: 200,
        message: 'Todo was update',
        data: { todos: result.data.todos },
      };
    } catch (err) {
      return {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error ',
        data: null,
      };
    }
  }

  async removeTodoById(id: number) {
    try {
      const findTodo = await this.getTodoById(id);
      if (!findTodo.data) {
        throw findTodo;
      }
      await this.todoModel.destroy({
        where: {
          id: id,
        },
      });

      const result = await this.getAllTodo();
      // console.log(result);
      return {
        statusCode: 200,
        message: 'Todo was deleted',
        data: { todos: result.data.todos },
      };
    } catch (err) {
      return {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error ',
        data: null,
      };
    }
  }
}
