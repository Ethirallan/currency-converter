import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyModule } from './currency/currency.module';
import { TypeOrmConfigService } from './shared/typeorm.service';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    CurrencyModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .exclude(
        { path: 'currency/getLastConversionRates/:secret', method: RequestMethod.ALL },
      )
      .forRoutes({
        path: '*', method: RequestMethod.ALL
      });
  }
}
