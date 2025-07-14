import { NUMBERS_URL, ANIMALS_URL } from '../constants';
import {
  compose,
  allPass,
  test,
  gt,
  lt,
  length,
  __,
  prop,
} from 'ramda';
import Api from '../tools/api';

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

const api = new Api();

const hasOnlyNumbersAndDots = test(/^[0-9.]+$/);
const isLongerThan2 = compose(lt(2), length);
const isShorterThan10 = compose(gt(10), length);
const isGreaterThanZero = compose(gt(__, 0), parseFloat);

const validateString = allPass([
  hasOnlyNumbersAndDots,
  isLongerThan2,
  isShorterThan10,
  isGreaterThanZero,
]);

const logAndReturn = (writeLog) => (value) => {
  writeLog(value);
  return value;
};

const parseAndRound = compose(Math.round, parseFloat);

const getBinaryFromNumber = (api) => (num) =>
  api.get(NUMBERS_URL, { from: 10, to: 2, number: num }).then(prop('result'));

const getBinaryLength = (binary) => binary.length;

const squareNumber = (num) => num * num;

const getMod3 = (num) => num % 3;

const getAnimalByMod = (api) => (mod) =>
  api.get(`${ANIMALS_URL}/${mod}`, {}).then(prop('result'));

const processValidatedValue = (writeLog, handleSuccess, handleError) => (str) => {
  const log = logAndReturn(writeLog);
  
  return Promise.resolve(str)
    .then(log)
    .then(parseAndRound)
    .then(log)
    .then(getBinaryFromNumber(api))
    .then(log)
    .then(getBinaryLength)
    .then(log)
    .then(squareNumber)
    .then(log)
    .then(getMod3)
    .then(log)
    .then(getAnimalByMod(api))
    .then(handleSuccess)
    .catch(handleError);
};

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  if (!validateString(value)) {
    handleError('ValidationError');
    return;
  }

  processValidatedValue(writeLog, handleSuccess, handleError)(value);
};

export default processSequence;

