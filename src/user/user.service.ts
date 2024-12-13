import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, Number(process.env.SALT_ROUNDS));

      const createdUser = await this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          balance: createUserDto.balance,
          password: hashedPassword,
        },
      });

      const newUser = new User();
      newUser.name = createdUser.name;
      newUser.email = createdUser.email;
      newUser.createdAt = createdUser.createdAt;
      newUser.updatedAt = createdUser.updatedAt;
      newUser.balance = createdUser.balance;

      return {
        message: 'Usuário criado com sucesso',
        statusCode: 201,
        user: newUser,
      };
    } catch (error) {
      console.log(error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            message: 'Essa conta de email já está em uso',
            statusCode: 409,
          };
        }
      }

      return {
        message: 'Error ao criar usuário',
        statusCode: 500,
      };
    }
  }

  async findAll() {
    try {
      const allPrismaUsers = await this.prismaService.user.findMany();
      const allUsers: User[] = [];

      allPrismaUsers.forEach((user) => {
        const newUser = new User();
        newUser.id = user.id;
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.createdAt = user.createdAt;
        newUser.updatedAt = user.updatedAt;
        newUser.balance = user.balance;
        allUsers.push(newUser);
      });

      return allUsers;
    } catch (error) {
      console.log(error);
      return new HttpException('Error ao buscar usuários', 500);
    }
  }

  async findOne(id: string) {
    try {
      const foundUser = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      })

      if (!foundUser) {
        return new NotFoundException(`Usuário com id ${id} não encontrado`);
      }

      const newUser = new User();
      newUser.name = foundUser.name;
      newUser.email = foundUser.email;
      newUser.createdAt = foundUser.createdAt;
      newUser.updatedAt = foundUser.updatedAt;
      newUser.balance = foundUser.balance;

      return newUser;
    } catch (error) {
      console.log(error);
      return new Error('Error fetching user');
    }
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      if (!deletedUser) {
        return new NotFoundException(`Usuário com id ${id} não encontrado`);
      }

      return deletedUser;
    } catch (error) {
      console.log(error);
      return new Error('Erro excluindo usuário');
    }
  }

  async comparePassword(email: string, password: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        throw new HttpException('Senha inválida', 401);
      }

      const newUser = new User();
      newUser.name = user.name;
      newUser.email = user.email;
      newUser.createdAt = user.createdAt;
      newUser.updatedAt = user.updatedAt;
      newUser.balance = user.balance;
      newUser.id = user.id;

      return newUser;

    } catch (error) {
      console.log(error);
      return new Error('Erro buscando senha do usuário');
    }
  }

}
