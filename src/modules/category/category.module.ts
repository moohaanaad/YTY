import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MessageService } from 'src/utils';
import { Category, CategoryRepository, categorySchema, Subcategory, SubcategoryRepository, subcategorySchema } from 'src/models';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Category.name, schema: categorySchema },
        { name: Subcategory.name, schema: subcategorySchema }
    ])],
    controllers: [CategoryController],
    providers: [CategoryRepository, SubcategoryRepository,CategoryService, MessageService]
})
export class CategoryModule { }
