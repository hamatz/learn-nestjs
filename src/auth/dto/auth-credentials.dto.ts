import { IsString, MinLength, Matches, MaxLength } from "class-validator";

export class AuthCredentiallsDto {

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Passowrd is too weak.'},)
    password: string;
}