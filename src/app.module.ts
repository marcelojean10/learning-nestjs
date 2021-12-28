import { Module } from '@nestjs/common';
import { join } from 'path'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
