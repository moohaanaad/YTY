import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategoryRepository, categorySchema, Community, CommunityRepository, communitySchema, Subcategory, SubcategoryRepository, subcategorySchema, User, UserRepository, userSchema } from "src/models";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MessageService } from "src/utils";


@Module({
    imports: [MongooseModule.forFeature([
        { name: Category.name, schema: categorySchema },
        { name: Subcategory.name, schema: subcategorySchema },
        { name: Community.name, schema: communitySchema },
        { name: User.name, schema: userSchema }
    ])],
    controllers: [CategoryController],
    providers: [
        CategoryRepository, SubcategoryRepository, CategoryService,
        MessageService, JwtService, ConfigService, UserRepository, CommunityRepository
    ]
})
export class CategoryModule { }
