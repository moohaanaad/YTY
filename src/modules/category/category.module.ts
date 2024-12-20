import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MessageService } from 'src/utils';
import { Category, CategoryRepository, categorySchema, Subcategory, SubcategoryRepository, subcategorySchema } from 'src/models';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/models/user/user.repository';
import { User, userSchema } from 'src/models/user/user.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Category.name, schema: categorySchema },
        { name: Subcategory.name, schema: subcategorySchema },
        { name: User.name, schema: userSchema }
    ])],
    controllers: [CategoryController],
    providers: [
        CategoryRepository, SubcategoryRepository, CategoryService,
         MessageService, JwtService, ConfigService, UserRepository
        ]
})
export class CategoryModule { }
