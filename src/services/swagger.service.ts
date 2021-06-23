import {
  INestApplication,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { serve, generateHTML } from 'swagger-ui-express';
import { PackageService } from './package.service';

@Injectable()
export class SwaggerService implements OnApplicationBootstrap {
  public readonly assetsMiddleware = serve;

  private readonly builder: DocumentBuilder = new DocumentBuilder();

  private document: Partial<OpenAPIObject>;
  private appRef: INestApplication;

  constructor(private readonly pkg: PackageService) {}

  private generateDocument() {
    if (!this.appRef)
      throw new Error(
        'Attempting to generate document before injecting app ref',
      );

    const baseDocument = this.builder
      .setTitle(this.pkg.name)
      .setVersion(this.pkg.version)
      .build();

    return SwaggerModule.createDocument(this.appRef, baseDocument);
  }

  onApplicationBootstrap() {
    // Generate document at the last moment to avoir racing conditions
    this.document = this.generateDocument();
  }

  init(app: INestApplication) {
    this.appRef = app;

    return true;
  }

  getInterface(documentUrl: string): string {
    const options = { swaggerOptions: { url: documentUrl } };

    return generateHTML(null, options);
  }

  getDocument(): OpenAPIObject {
    console.log('document : ', document);
    if (!this.document)
      throw new Error(
        'You have to inject application context before generating documentation',
      );

    return this.document as OpenAPIObject;
  }
}
