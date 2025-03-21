import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategoryRepository, categorySchema, Community, CommunityRepository, communitySchema, Subcategory, SubcategoryRepository, subcategorySchema, User, UserRepository, userSchema } from "src/models";
import { MessageService } from "src/utils";
import { SubcategoryController } from "./subcategory.controller";
import { SubcategoryService } from "./subcategory.service";


@Module({
    imports: [MongooseModule.forFeature([
        { name: Subcategory.name, schema: subcategorySchema },
        { name: Category.name, schema: categorySchema },
        { name: Community.name, schema: communitySchema },
        { name: User.name, schema: userSchema }
    ])
    ],
    controllers: [SubcategoryController],
    providers: [
        SubcategoryService, CategoryRepository, SubcategoryRepository, 
        MessageService, JwtService, ConfigService, UserRepository, CommunityRepository
    ]
})
export class SubcategoryModule { }
