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

@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Query('page') page: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<Success | Error> {
    try {
      const res = await this.todosService.createTodo({
        createTodoDto,
        offset: +offset,
        limit: +limit,
        page: +page,
      });
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

  @Get()
  async getAllTodo(
    @Query('page') page: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<Success | Error> {
    try {
      const res = await this.todosService.getAllTodo({
        offset: +offset,
        limit: +limit,
        page: +page,
      });
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

  @Get('/completed')
  async getCompletedTodo(
    @Query('page') page: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<Success | Error> {
    try {
      const res = await this.todosService.getCompletedTodo({
        offset: +offset,
        limit: +limit,
        page: +page,
      });
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

  @Get('/passed')
  async getPassedTodo(
    @Query('page') page: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<Success | Error> {
    try {
      const res = await this.todosService.getPassedTodo({
        offset: +offset,
        limit: +limit,
        page: +page,
      });
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

  @Patch(':id')
  async updateTodoById(
    @Param('id') id: string,
    @Query('offset') offset: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Success | Error> {
    try {
      const res = await this.todosService.updateTodoById({
        id: +id,
        updateTodoDto,
        offset: +offset,
        limit: +limit,
        page: +page,
      });
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

  @Delete(':id')
  async removeTodoById(
    @Param('id') id: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<Success | Error> {
    try {
      const res = await this.todosService.removeTodoById({
        id: +id,
        offset: +offset,
        limit: +limit,
        page: +page,
      });
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
