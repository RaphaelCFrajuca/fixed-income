import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import "reflect-metadata";
import { FixedIncomeModule } from "./fixed-income.module";

async function bootstrap() {
    const app = await NestFactory.create(FixedIncomeModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            forbidNonWhitelisted: true,
        }),
    );
    await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
