import { Module } from '@nestjs/common';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategoryRepository, categorySchema, Subcategory, SubcategoryRepository, subcategorySchema, User, UserRepository, userSchema } from 'src/models';
import { MessageService } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Subcategory.name, schema: subcategorySchema },
        { name: Category.name, schema: categorySchema },
        { name: User.name, schema: userSchema }
    ])
    ],
    controllers: [SubcategoryController],
    providers: [
        SubcategoryService, CategoryRepository, SubcategoryRepository, 
        MessageService, JwtService, ConfigService, UserRepository
    ]
})
export class SubcategoryModule { }
