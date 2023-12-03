import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Success, Error } from './types';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post(':current')
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Param('current') current: string
  ): Promise<Success | Error> {
    try {
      const res = await this.todosService.createTodo(createTodoDto, current);
      if (!res.data) {
        throw res;
      }
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          data: error.data || null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':current')
  async getAllTodo(
  @Query('page') page: string,
  @Param('current') current: string
  ): Promise<Success | Error> {
    try {
      const res = await this.todosService.getAllTodo(+page, current);
      if (!res.data) {
        throw res;
      }
      return res as Success;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          data: error.data || null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getTodoById(@Param('id') id: string): Promise<Success | Error> {
    try {
      const res = await this.todosService.getTodoById(+id);
      if (!res.data) {
        throw res;
      }
      return res as Success;
    } catch (error) {
      throw new HttpException(
        {
          status: error.statusCode || HttpStatus.BAD_REQUEST,
          message: error.message,
          data: error.data || null,
        },
        error.statusCode === 404
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':current/:id')
  async updateTodoById(
    @Param('id') id: string,
    @Param('current') current: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Success | Error> {
    console.log(current);
    try {
      const res = await this.todosService.updateTodoById(+id, updateTodoDto, current);
      if (!res.data) {
        throw res;
      }
      return res as Success;
    } catch (error) {
      throw new HttpException(
        {
          status: error.statusCode || HttpStatus.BAD_REQUEST,
          message: error.message,
          data: error.data || null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':current/:id')
  async removeTodoById(
    @Param('id') id: string,
    @Param('current') current: string,
    ): Promise<Success | Error> {
    try {
      const res = await this.todosService.removeTodoById(+id, current);
      if (!res.data) {
        throw res;
      }
      return res as Success;
    } catch (error) {
      throw new HttpException(
        {
          status: error.statusCode || HttpStatus.BAD_REQUEST,
          message: error.message,
          data: error.data || null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
