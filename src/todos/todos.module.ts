import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodoModel } from './todo.model';

@Module({
  imports: [SequelizeModule.forFeature([TodoModel])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
