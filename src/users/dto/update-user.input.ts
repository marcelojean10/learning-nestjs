import { InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateUserInput {
  @IsEmail()
  @IsNotEmpty({message: 'Este campo não pode estar vazio'})
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty({message: 'Este campo não pode estar vazio'})
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty({message: 'Este campo não pode estar vazio'})
  @IsOptional()
  password?: string;
}
