import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/models/user/user.repository';
import { UserStatus } from 'src/utils/enums/user.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepo: UserRepository
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    try {
    const request = context.switchToHttp().getRequest();
    let { authorization:token } = request.headers
     
    
      token = token.split(" ")[1]
      //check token exist
      if (!token) {
        throw new UnauthorizedException()
      }

      //verify token
      const { _id } = await this.jwtService.verify(token, { secret: this.configService.get<string>('SECRET_LOGIN_TOKEN') })
      if (!_id) {
        throw new UnauthorizedException()
      }

      //check user existence
      const userExist = await this.userRepo.findById(_id).select("-password")
      if (!userExist || userExist?.status == UserStatus.OFFLINE) {
        throw new UnauthorizedException()
      }

      //prepare data
      request.user = userExist
      return true;

    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }
}
