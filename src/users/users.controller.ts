import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { Role as RoleEnum, User as UserEntity } from '@prisma/client';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { User } from './decorator/user.decorator';
@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@User() user: UserEntity) {
    return this.usersService.findOne(user.id);
  }

  @Get()
  @Role(RoleEnum.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Role(RoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('create')
  @Role(RoleEnum.ADMIN)
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Role(RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Role(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
