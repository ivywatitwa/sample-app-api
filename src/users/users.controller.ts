import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/auth.pub';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private authService: AuthService) {}
 
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
  try {
    const hashedPassword = await this.usersService.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;
    const createdUser = await this.usersService.create(createUserDto);
    return createdUser;
  }  catch (error) {
    if (error.code === 'DUPLICATE_USERNAME_ERROR') {
      throw new Error('Username is already taken');
    } else {
      console.log(error);
      throw error;
    }
  }
}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}


