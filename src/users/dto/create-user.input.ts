import { InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateUserInput {
  @IsEmail()
  @IsNotEmpty({message: 'Este campo não pode estar vazio'})
  email: string;

  @IsString()
  @IsNotEmpty({message: 'Este campo não pode estar vazio'})
  username: string;

  @IsString()
  @IsNotEmpty({message: 'Este campo não pode estar vazio'})
  password: string;
}
