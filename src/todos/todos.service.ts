import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { Success, Error, IPropsCreateTodo, IPropsRemoveTodoById, IPropsUpdateTodoById, IPropsGet } from './types';
import { TodoModel } from './todo.model';
import { checkDeadline } from './helper/checkDeadline';

@Injectable()
export class TodosService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(TodoModel)
    private todoModel: typeof TodoModel,
  ) {}

  private _page = 2;

  get Page() {
    return this._page;
  }

  set Page(newPage) {
    this._page = newPage;
  }

  async createTodo({
    createTodoDto,
    offset,
    limit,
    page,
  }: IPropsCreateTodo): Promise<Success | Error> {
    try {
      await this.todoModel.create({ ...createTodoDto });
      const getAll = this.getAllTodo({ offset, limit, page });
      const getCompleted = this.getCompletedTodo({ offset, limit, page });
      const getPassed = this.getPassedTodo({ offset, limit, page });

      const [all, completed, passed] = await Promise.all([
        getAll,
        getCompleted,
        getPassed,
      ]);

      return {
        statusCode: 201,
        message: 'Todo was created',
        data: {
          todos: {
            all: all.data.todos.all,
            completed: completed.data.todos.completed,
            passed: passed.data.todos.passed,
          },
          pagination: {
            page: this.Page,
            maxPage: {
              all: all.data.pagination.maxPage.all,
              completed: completed.data.pagination.maxPage.completed,
              passed: passed.data.pagination.maxPage.passed,
            },
          },
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

  async getAllTodo({
    offset,
    limit,
    page,
  }: IPropsGet): Promise<Success | Error> {
    let all: any;
    try {
      const allTodos = await this.todoModel.findAll({
        order: [['id', 'DESC']],
        where: {
          completed: false,
        },
      });
      all = allTodos.filter((el) => !checkDeadline(el.deadline));

      this.Page = page;

      return {
        statusCode: 200,
        message: 'All todo',
        data: {
          todos: {
            all: all.slice(offset, limit),
          },
          pagination: {
            maxPage: {
              all:
                all.length % 10 === 0
                  ? all.length / 10
                  : Math.floor(all.length / 10) + 1,
            },
            page: this.Page,
          },
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

  async getCompletedTodo({
    offset,
    limit,
    page,
  }: IPropsGet): Promise<Success | Error> {
    let completed: any;

    try {
      const completedTodos = await this.todoModel.findAll({
        order: [['id', 'DESC']],
        where: {
          completed: true,
        },
      });
      completed = completedTodos;

      this.Page = page;

      return {
        statusCode: 200,
        message: 'Completed todo',
        data: {
          todos: {
            completed: completed.slice(offset, limit),
          },
          pagination: {
            maxPage: {
              completed:
                completed.length % 10 === 0
                  ? completed.length / 10
                  : Math.floor(completed.length / 10) + 1,
            },
            page: this.Page,
          },
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

  async getPassedTodo({
    offset,
    limit,
    page,
  }: IPropsGet): Promise<Success | Error> {
    let passed: any;

    try {
      const passedTodos = await this.todoModel.findAll({
        order: [['id', 'DESC']],
        where: {
          completed: false,
        },
      });
      passed = passedTodos.filter((el) => checkDeadline(el.deadline));

      this.Page = page;

      return {
        statusCode: 200,
        message: 'Passed todo',
        data: {
          todos: {
            passed: passed.slice(offset, limit),
          },
          pagination: {
            maxPage: {
              passed:
                passed.length % 10 === 0
                  ? passed.length / 10
                  : Math.floor(passed.length / 10) + 1,
            },
            page: this.Page,
          },
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

  async updateTodoById({
    id,
    updateTodoDto,
    offset,
    limit,
    page,
  }: IPropsUpdateTodoById): Promise<Success | Error> {
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

      const getAll = this.getAllTodo({ offset, limit, page });
      const getCompleted = this.getCompletedTodo({ offset, limit, page });
      const getPassed = this.getPassedTodo({ offset, limit, page });

      const [all, completed, passed] = await Promise.all([
        getAll,
        getCompleted,
        getPassed,
      ]);

      return {
        statusCode: 200,
        message: 'Todo was update',
        data: {
          todos: {
            all: all.data.todos.all,
            completed: completed.data.todos.completed,
            passed: passed.data.todos.passed,
          },
          pagination: {
            page: this.Page,
            maxPage: {
              all: all.data.pagination.maxPage.all,
              completed: completed.data.pagination.maxPage.completed,
              passed: passed.data.pagination.maxPage.passed,
            },
          },
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

  async removeTodoById({
    id,
    offset,
    limit,
    page,
  }: IPropsRemoveTodoById): Promise<Success | Error> {
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

      const getAll = this.getAllTodo({ offset, limit, page });
      const getCompleted = this.getCompletedTodo({ offset, limit, page });
      const getPassed = this.getPassedTodo({ offset, limit, page });

      const [all, completed, passed] = await Promise.all([
        getAll,
        getCompleted,
        getPassed,
      ]);

      return {
        statusCode: 200,
        message: 'Todo was deleted',
        data: {
          todos: {
            all: all.data.todos.all,
            completed: completed.data.todos.completed,
            passed: passed.data.todos.passed,
          },
          pagination: {
            page: this.Page,
            maxPage: {
              all: all.data.pagination.maxPage.all,
              completed: completed.data.pagination.maxPage.completed,
              passed: passed.data.pagination.maxPage.passed,
            },
          },
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
}
