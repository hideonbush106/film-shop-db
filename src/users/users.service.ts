import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma, Role } from '@prisma/client';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
      // return user;
      return this.signToken({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
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
    const users = await this.prismaService.user.findUnique({
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
    if (!users) {
      throw new NotFoundException('User not found');
    }
    return users;
  }

  async update(id: string, updateUserDto: UserDto) {
    try {
      const hashedPassword = await argon2.hash(updateUserDto.password);
      console.log(id);
      console.log(updateUserDto);
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
      console.log('user', user);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
    }
  }

  async signToken(payload: {
    sub: string;
    name: string | null;
    email: string;
    role: Role;
  }) {
    const secret = this.configService.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '1d',
    });
    return {
      access_token: token,
    };
  }
}
