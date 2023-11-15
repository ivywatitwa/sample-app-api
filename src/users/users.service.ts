import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ){}
  async create(createUserDto: CreateUserDto) {
   const users = this.userRepository.create(createUserDto);

   return  await this.userRepository.save(users);
  }

    async findAll(): Promise<User[]> {
      return await this.userRepository.find();
    }

  async findOne(id: number) {
    return await this.userRepository.find({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    if (updateUserDto.firstName){
      user.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.middleName){
      user.middleName = updateUserDto.middleName;
    }
    if (updateUserDto.lastName){
      user.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.username){
      user.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      const hashedPassword = await this.hashPassword(updateUserDto.password);
      user.password = hashedPassword;
    }
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
    return `User with ID ${id} has been successfully removed.`;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; 

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.find({ where: {username} });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user[0];
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    
    console.log('plainPassword');
    console.log(plainPassword);

    console.log('hashedPassword');
    console.log(hashedPassword);
    if (!plainPassword || !hashedPassword) {
      throw new Error('data and hash arguments required');
    }
  
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
}
