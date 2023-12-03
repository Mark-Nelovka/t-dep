import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Success, Error } from './types';
import { TodoModel } from './todo.model';
import { TodoEntity } from './entities/todo.entity';
import { checkDeadline } from './helper/checkDeadline';

@Injectable()
export class TodosService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(TodoModel)
    private todoModel: typeof TodoModel,
  ) {}

  private _page = 1;

  get Page() {
    return this._page;
  }

  set Page(newPage) {
    this._page = newPage;
  }
  //   async addMore(props: CreateTodoDto[]): Promise<Success | Error> {
  //             const studentData = props.map((dto) => ({
  //         title: dto.title,
  //         description: dto.description,
  //         deadline: dto.deadline,
  //         completed: dto.completed,
  //       }));
  //   try {
  //     await this.sequelize.transaction(async (t) => {
  //       const transactionHost = { transaction: t };
  //       await this.todoModel.bulkCreate(studentData, transactionHost);
  //     });
  //     return {
  //       statusCode: 201,
  //       message: 'Todo was created',
  //       data: { todos: null,
  //         countTodos: 1,
  //       page: 1 },
  //     };
  //   } catch (err) {
  //     return {
  //       statusCode: err.statusCode || 500,
  //       message: err.message || 'Internal Server Error ',
  //       data: null,
  //     };
  //   }
  // }

  async createTodo(createTodoDto: CreateTodoDto, current: string): Promise<Success | Error> {
    try {
      await this.todoModel.create({ ...createTodoDto });
      const todos = await this.getAllTodo(1, current);

      return {
        statusCode: 201,
        message: 'Todo was created',
        data: { todos: todos.data.todos,
          countTodos: todos.data.countTodos,
          page: this.Page
        },
      };
    } catch (err) {
      return {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error ',
        data: null,
      };
    }
  }

  async getAllTodo(page: number, current: string): Promise<Success | Error> {
    const firstIndex = page === 1 ? 0 * 10 : page * 10 - 10;
    const lastIndex = page * 10;
    let result:TodoEntity[];
    try {
      let allTodos: any;

      switch (current) {
        case 'completed':
           allTodos = await this.todoModel.findAll({
            order: [['id', 'DESC']],
            where: {
              completed: true,
            }
          });
          result = allTodos;
          break;
        case 'passed':
           allTodos = await this.todoModel.findAll({
            order: [['id', 'DESC']],
            where: {
              completed: false
            }
          });
          result = allTodos.filter((el) => checkDeadline(el.deadline));
        break;
        default:
           allTodos = await this.todoModel.findAll({
            order: [['id', 'DESC']],
            where: {
              completed: false
            }
          });
          result = allTodos.filter((el) => !checkDeadline(el.deadline));
          break;
      }

      this.Page = page;

      return {
        statusCode: 200,
        message: 'All todo',
        data: { 
        todos: result.slice(firstIndex, lastIndex),
        countTodos: result.length,
        page: this.Page
        },
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

  async updateTodoById(id: number, updateTodoDto: UpdateTodoDto, current: string) {
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
      const result = await this.getAllTodo(this.Page, current);
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

  async removeTodoById(id: number, current: string) {
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

      const result = await this.getAllTodo(this.Page, current);
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
