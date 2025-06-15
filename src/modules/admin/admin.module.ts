import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Category, CategoryRepository, categorySchema, Community, CommunityRepository, communitySchema, User, UserRepository, userSchema } from 'src/models';
import { OpportunityRepository } from 'src/models/opportunity/opportunity.repository';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from 'src/utils';
import { RolesGuard } from 'src/guard/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Opportunity, OpportunitySchema } from 'src/models/opportunity/opportunity.schema';
import { UserService } from '../user/user.service';
import { CheckExistService } from '../user/checkExist.service';
import { CategoryService } from '../category/category.service';
import { PasswordService } from 'src/common';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: userSchema },
    { name: Community.name, schema: communitySchema },
    { name: Opportunity.name, schema: OpportunitySchema },
    { name: Category.name, schema: categorySchema }
  ])],
  controllers: [AdminController],
  providers: [AdminService, UserRepository, CommunityRepository, OpportunityRepository, JwtService, PasswordService, MessageService, RolesGuard, UserService, CheckExistService, CategoryRepository],
})
export class AdminModule { }
