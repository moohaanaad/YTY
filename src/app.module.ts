import { Module } from '@nestjs/common';
import { CategoryModule } from './modules/category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/YTY'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
