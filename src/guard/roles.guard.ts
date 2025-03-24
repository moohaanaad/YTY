import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/modules/authorization/roles.decorator";
import { UserRole } from "src/utils/enums/user.enums";
import { CustomRequest } from "src/types/custom-request.interface";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]); 

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<CustomRequest>();
        const user = request.user;

        console.log('User:', user); // Debugging

        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        return true;
    }
}
