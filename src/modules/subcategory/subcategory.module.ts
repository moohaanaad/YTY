import { Module } from '@nestjs/common';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryService } from './subcategory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategoryRepository, categorySchema, Subcategory, SubcategoryRepository, subcategorySchema } from 'src/models';
import { MessageService } from 'src/utils';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Subcategory.name, schema: subcategorySchema },
        { name: Category.name, schema: categorySchema }
    ])
    ],
    controllers: [SubcategoryController],
    providers: [SubcategoryService, CategoryRepository, SubcategoryRepository, MessageService]
})
export class SubcategoryModule { }
