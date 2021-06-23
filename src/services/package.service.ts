import { Injectable, OnModuleInit } from '@nestjs/common';
import * as pkgInfo from 'pkginfo';

@Injectable()
export class PackageService implements OnModuleInit {
  private info: any;

  get version() {
    return this.info.version;
  }

  get name() {
    return this.info.name;
  }

  get description() {
    return this.info.description;
  }

  async onModuleInit() {
    // Uses current module as a path reference to lookup
    this.info = pkgInfo.find(module);
  }
}
