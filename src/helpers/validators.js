import { 
  allPass,
  anyPass,
  compose,
  equals,
  filter,
  length, 
  prop,
  propEq,
  values,
  complement,
  whereEq,
  countBy,
  identity 
} from 'ramda';

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// Вспомогательные функции

const isWhite = equals('white');
const isRed = equals('red');

const getColors = values;
const countByColor = color => compose(length, filter(equals(color)), getColors);
const countRed = countByColor('red');
const countGreen = countByColor('green');
const countBlue = countByColor('blue');

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  propEq('star', 'red'),
  propEq('square', 'green'),
  propEq('triangle', 'white'),
  propEq('circle', 'white')
]);

// 2. Как минимум две фигуры зеленые.
//export const validateFieldN2 = () => false;
export const validateFieldN2 = shapes => countGreen(shapes) >= 2;

// 3. Количество красных фигур равно кол-ву синих.
//export const validateFieldN3 = () => false;
export const validateFieldN3 = shapes => countRed(shapes) === countBlue(shapes);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  propEq('circle', 'blue'),
  propEq('star', 'red'),
  propEq('square', 'orange')
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = shapes => {
  const colorCounts = countBy(identity, getColors(shapes));
  return Object.entries(colorCounts)
    .filter(([color]) => color !== 'white')
    .some(([, count]) => count >= 3);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  shapes => countGreen(shapes) === 2,
  propEq('triangle', 'green'),
  shapes => countRed(shapes) === 1
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = whereEq({
  star: 'orange',
  square: 'orange',
  triangle: 'orange',
  circle: 'orange'
});

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  compose(
    complement(anyPass([isRed, isWhite])),
    prop('star')
  )
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = whereEq({
  star: 'green',
  square: 'green',
  triangle: 'green',
  circle: 'green'
});

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  shapes => {
    const triangleColor = shapes.triangle;
    const squareColor = shapes.square;
    return triangleColor === squareColor && triangleColor !== 'white';
  }
]);

