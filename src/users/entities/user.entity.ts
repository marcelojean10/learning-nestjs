import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn() 
  @Field(() => ID)
  id?: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;
}
