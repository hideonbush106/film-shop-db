import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Film Shop')
    .setDescription('This page contains REST API documentation for film shop')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      description: 'Enter JWT token',
    })
    .build();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}
bootstrap();
