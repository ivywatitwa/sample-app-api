import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from '../constants/constants';
  import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../auth/auth.pub';
import { Reflector } from '@nestjs/core';

  
  @Injectable()
  export class AuthGuard implements CanActivate {
    
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!token && !isPublic) {
        console.log("No token", isPublic)
        throw new UnauthorizedException();
      }

      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
        );
        request['user'] = payload;
      } catch {
        console.log("Token auth err")
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }