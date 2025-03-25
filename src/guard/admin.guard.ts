import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { CustomRequest } from "src/types/custom-request.interface";
import { UserRole } from "src/utils";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const user = request.user;
    console.log('User:', user); // Debugging

    if (!user) {
      throw new ForbiddenException("You are not authenticated.");
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Only admin can perform this action.");
    }

    return true;
  }
}
