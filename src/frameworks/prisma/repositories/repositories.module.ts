import { Module } from '@nestjs/common';
import { CreateModule } from './create';

@Module({
  imports: [CreateModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class RepositoriesModule {}
