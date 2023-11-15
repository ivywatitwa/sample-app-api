import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}
    
      async signIn(username, pass) {
        const user = await this.usersService.findByUsername(username);

        console.log('user');
        console.log(user.password);

        if (!this.usersService.comparePassword(pass, user.password)) {
          throw new UnauthorizedException();
        }

       
        const payload = { sub: user['id'], username: user['username'] };
        return {
            user: user,
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
