import * as functions from './functions';
const SPECIAL_CHARACTER = '&#xFEFF;';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...functions,
  SPECIAL_CHARACTER,
}