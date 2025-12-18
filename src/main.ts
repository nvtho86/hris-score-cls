import { NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


