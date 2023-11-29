import { DataTypes } from 'sequelize';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'todos',
  timestamps: true,
})
export class TodoModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column({ allowNull: false, type: DataTypes.INTEGER })
  id: number;

  @Column({ allowNull: false, type: DataTypes.STRING })
  title: string;

  @Column({ allowNull: false, type: DataTypes.TEXT })
  description: string;

  @Column({ type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW })
  date: string;
}
