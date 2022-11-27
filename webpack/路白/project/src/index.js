import add from "./add";
import multiply from "./multiply";
import { once } from 'lodash'

const onceAdd = once(add);
const addResult = onceAdd(1, 1);
const mulResult = multiply(1, 1);
// const arr = [7727, 22029, 25030, 36532, 29506, 24157, 27458, 15322, 6298, 5973, 21344]
// const total = arr.reduce((a,b) => {return a + b})
// console.log(total);
console.log(addResult);
console.log(mulResult);