import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors()
  const config = new DocumentBuilder()
    .setTitle('Expense Tracker API')
    .setDescription('Simple expense tracker endpoints')
    .setVersion('1.0.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, doc)
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
