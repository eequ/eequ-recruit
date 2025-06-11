import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MainModule } from './main/main.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './database/database.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync(typeormModuleOptions),
    MainModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {
}
