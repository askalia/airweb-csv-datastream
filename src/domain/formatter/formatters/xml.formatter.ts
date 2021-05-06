import { IFormatter } from '../models/iformatter.model';
import * as xmlParser from 'js2xmlparser';

const DEFAULT_NODE_NAME = 'dataset';

export class XMLFormatter extends IFormatter {
  static id = 'xml';
  static description = 'a simple xml formatter';

  async format(data, dataType = DEFAULT_NODE_NAME) {
    return {
      formattedStream: xmlParser.parse(dataType, data),
      contentType: 'text/xml',
    };
  }
}
