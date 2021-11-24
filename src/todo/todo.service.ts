import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(private readonly dbService: DatabaseService) { }

  create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo[]> {
    return this.dbService.executeQuery(
      `INSERT INTO public."Todo" (task, creator) VALUES($1, $2)`,
      [createTodoDto.task, userId],
    );
  }

  findAll(): Promise<Todo[]> { // userId: string
    return this.dbService.executeQuery(
      `SELECT * FROM public."Todo" ORDER by created_at ASC`, []
      // `SELECT * FROM public."Todo"  WHERE creator = $1`, 
      // [userId],
    );
  }

  findOne(id: string, userId: string): Promise<Todo[]> {
    return this.dbService.executeQuery(
      `SELECT * FROM public."Todo" WHERE id = $1 AND creator = $2`,
      [id, userId],
    );
  }

  update(id: string, updateTodoDto: UpdateTodoDto, userId: string): Promise<Todo[]> {
    let updateStatement = `UPDATE public."Todo" SET `;
    let i = 1;
    const values = [];
    Object.keys(updateTodoDto).forEach((key) => {
      updateStatement += `${key} = $${i}, `;
      i += 1;
    });
    updateStatement = updateStatement.slice(0, -2);
    updateStatement += ` WHERE id = $${i} AND creator = '${userId}';`; //  ,updated_at = now()

    Object.keys(updateTodoDto).forEach((key) => {
      values.push(updateTodoDto[key]);
    });

    values.push(id);

    return this.dbService.executeQuery(updateStatement, values);
  }

  remove(id: string, userId: string): Promise<Todo[]> {
    return this.dbService.executeQuery(
      `DELETE FROM public."Todo" WHERE id = $1 AND creator = $2`,
      [id, userId],
    );
  }
}
