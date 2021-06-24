import { IFormatter } from '../../common/models';
import * as xmlParser from 'js2xmlparser';
import { Injectable } from '@nestjs/common';
import { FormatterProvider } from '../formatter.decorator';
import { Readable, Writable } from 'node:stream';

const DEFAULT_NODE_NAME = 'dataset';

@Injectable()
@FormatterProvider({
  id: 'xml',
  description: 'a simple xml formatter',
})
export class XMLFormatter extends IFormatter {
  async format(
    data,
    options: {
      dataTypeName: string;
    } = {
      dataTypeName: DEFAULT_NODE_NAME,
    },
  ) {
    return {
      formattedStream: xmlParser.parse(options.dataTypeName, data),
      contentType: 'text/xml',
    };
  }

  formatAsync({
    inputStream,
    output,
    chunkSize,
    options,
  }: {
    inputStream: Readable;
    output: Writable;
    chunkSize?: number;
    options?: {
      dataTypeName: string;
    };
  }) {
    throw new Error('XMLFormatter.formatASync() is not yet implemented');
  }
}
