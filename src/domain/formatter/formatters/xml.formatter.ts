import { IFormatter } from '../models/fomatter.abstract';
import * as xmlParser from 'js2xmlparser';
import { FormatsAllowed } from '../models/formats-allowed.model';

const DEFAULT_NODE_NAME = 'dataset';

export class XMLFormatter extends IFormatter {
  static id = 'xml';
  static description = 'a simple xml formatter';
  async format(data, dataType = DEFAULT_NODE_NAME) {
    console.log('data = ', xmlParser.parse(dataType, data));
    return {
      formattedStream: xmlParser.parse(dataType, data),
      contentType: FormatsAllowed.XML,
    };
  }
}
