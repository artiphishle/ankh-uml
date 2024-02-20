import {TS_FILE} from 'src/types/regex.constants';

export function mustMatchTsFile(str: string) {
  return TS_FILE.test(str);
}
