import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(username: string, password: string) {
        const user = await this.usersService.findByUsername(username);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // if (!user.isActive) {
        //     throw new UnauthorizedException('User is inactive');
        // }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = {
            sub: user.id,
            username: user.username,
            group: user.group?.name,
        };
console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                group: user.group?.name,
            },
        };
    }
}
