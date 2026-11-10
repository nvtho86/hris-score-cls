import { Module } from '@nestjs/common';
import { HrisApiService } from './hris-api.service';

@Module({
  providers: [HrisApiService],
  exports: [HrisApiService],
})
export class HrisApiModule {}