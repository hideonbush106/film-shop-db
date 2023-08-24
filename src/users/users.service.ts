import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma } from '@prisma/client';
import { RegisterDto } from 'src/auth/dto/register.dto';
@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: UserDto | RegisterDto) {
    try {
      const hashedPassword = await argon2.hash(createUserDto.password);
      let user;
      if (createUserDto instanceof RegisterDto) {
        user = await this.prismaService.user.create({
          data: {
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
            role: 'USER',
          },
        });
      } else {
        user = await this.prismaService.user.create({
          data: {
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
            role: createUserDto.role,
          },
        });
      }
      //TODO: return JWT token instead of user
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
    }
  }

  async findAll() {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        favoriteFilms: true,
      },
    });
    return users;
  }

  async findOne(id: string) {
    const users = await this.prismaService.user.findMany({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        favoriteFilms: true,
      },
    });
    return users;
  }

  async update(id: string, updateUserDto: UserDto) {
    try {
      const hashedPassword = await argon2.hash(updateUserDto.password);
      const user = await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: hashedPassword,
          role: updateUserDto.role,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
    }
  }

  async remove(id: string) {
    await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
    throw new HttpException('success', HttpStatus.OK);
  }
}
