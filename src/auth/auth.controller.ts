import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post()
  async signIn(@Body() signInDTO: SignInDTO) {
    return this.authService.signIn(signInDTO.email, signInDTO.password);
  }
}
