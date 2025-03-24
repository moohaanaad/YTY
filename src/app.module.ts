import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { CommunityModule } from './modules/community/community.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: './config/.env',
    isGlobal: true,
    cache: true
  }),
    MongooseModule.forRoot(process.env.DB_HOST),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    CategoryModule,SubcategoryModule,AuthModule,UserModule,CommunityModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
