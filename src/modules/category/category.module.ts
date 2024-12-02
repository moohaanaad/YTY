import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MessageService } from 'src/utils';
import { Category, CategoryRepository, CategorySchema } from 'src/models';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
    controllers: [CategoryController],
    providers: [CategoryRepository, CategoryService, MessageService]
})
export class CategoryModule { }
