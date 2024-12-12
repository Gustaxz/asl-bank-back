import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UserService, private jwtService: JwtService) { }

    async signIn(
        email: string,
        pass: string,
    ): Promise<{ access_token: string, message?: string, statusCode?: number } | Error> {
        const user = await this.usersService.comparePassword(email, pass);
        if (user instanceof HttpException || user instanceof Error) {
            console.log(user);
            return {
                access_token: null,
                message: 'Invalid credentials',
                statusCode: 422,
            };
        }
        const payload = { sub: user.id, username: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };

    }
}
