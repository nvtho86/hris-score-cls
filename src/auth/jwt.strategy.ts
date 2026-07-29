import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret123', // 🔥 PHẢI TRÙNG
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload); // 🔥 DEBUG
    return payload;
  }
}
