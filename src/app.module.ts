import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodosModule } from './todos/todos.module';
import { TodoModel } from './todos/todo.model';

@Module({
  imports: [
    TodosModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadModels: true,
      models: [TodoModel],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
