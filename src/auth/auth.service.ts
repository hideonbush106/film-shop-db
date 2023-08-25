import { Injectable, ForbiddenException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: loginDto.email,
        },
      });

      //Check if user exists
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      //Verify password
      const isPasswordValid = await argon2.verify(
        user.password,
        loginDto.password,
      );
      if (!isPasswordValid) {
        throw new ForbiddenException('Invalid credentials');
      }

      return this.signToken({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      throw error;
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
