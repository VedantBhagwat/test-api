import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createUserDto: CreateUserDto) {
    return this.dbService.executeQuery(
      `INSERT INTO public."User"(email, password) VALUES ($1, $2) RETURNING id`,
      [createUserDto.email, createUserDto.password],
    );
  }

  findAll() {
    return this.dbService.executeQuery(`SELECT * FROM public."User"`, []);
  }

  findOne(email: string) {
    return this.dbService.executeQuery(
      `SELECT * FROM public."User" WHERE email = $1`,
      [email],
    );
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    let updateStatement = `UPDATE public."User" SET `;
    let i = 1;
    const values = [];
    Object.keys(updateUserDto).forEach((key) => {
      updateStatement += `${key} = $${i}, `;
      i += 1;
    });
    updateStatement = updateStatement.slice(0, -2);
    updateStatement += ` WHERE id = $${i};`;

    Object.keys(updateUserDto).forEach((key) => {
      values.push(updateUserDto[key]);
    });

    values.push(id);
    try {
      return this.dbService.executeQuery(updateStatement, values);
    } catch{

    }
  }

  remove(id: string) {
    return this.dbService.executeQuery(
      `DELETE FROM public."User" WHERE id = $1`,
      [id],
    );
  }
}
