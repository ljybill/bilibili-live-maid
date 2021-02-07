import { shuffle } from 'lodash-es';

const num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function genAnswer(): Array<number> {
  return shuffle(num)
    .slice(0, 4);
}

export function validate(str: string): boolean {
  if (str.length !== 4) {
    return false;
  }
  if (str
    .split('')
    .filter((char) => num.includes(+char))
    .length !== 4) {
    return false;
  }
  if (new Set(str.split('')).size !== 4) {
    return false;
  }
  return true;
}

export function judge(str: string, answer: Array<number>): { isRight: boolean, feedback: string } {
  let a = 0;
  let b = 0;

  for (let i = 0; i < str.length; i += 1) {
    if (Number(str[i]) === answer[i]) {
      a += 1;
    } else if (answer.includes(Number(str[i]))) {
      b += 1;
    }
  }

  if (a === 4) {
    return {
      isRight: true,
      feedback: '',
    };
  }
  return {
    isRight: false,
    feedback: `${a}A${b}B`,
  };
}

export default {
  genAnswer,
  validate,
  judge,
};
