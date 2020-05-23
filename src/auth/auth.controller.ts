import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthCredentiallsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentiallsDto) : Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signIn')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentiallsDto) : Promise<{ accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }

}
