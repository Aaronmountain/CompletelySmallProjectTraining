const inventors = [
  { first: 'Albert', last: 'Einstein', year: 1879, passed: 1955 },
  { first: 'Isaac', last: 'Newton', year: 1643, passed: 1727 },
  { first: 'Galileo', last: 'Galilei', year: 1564, passed: 1642 },
  { first: 'Marie', last: 'Curie', year: 1867, passed: 1934 },
  { first: 'Johannes', last: 'Kepler', year: 1571, passed: 1630 },
  { first: 'Nicolaus', last: 'Copernicus', year: 1473, passed: 1543 },
  { first: 'Max', last: 'Planck', year: 1858, passed: 1947 },
];

// 過濾 1500 ~ 1600 year 以外的人
// const newData = inventors.filter((person) => person.year >= 1500 && person.year <= 1600);
// console.table(newData);

// 組合 first name、last name 成新陣列
// const newData = inventors.map((person) => {
//   return `${person.first}  ${person.last}`;
// });
// console.table(newData);

// 生日的排序
// const newData = inventors.sort((a, b) => {
//   // a > b 為 true，回傳值大於 0，則 b 會放在 a 的左邊。
//   return a.year > b.year ? 1 : -1;
// });
// console.table(newData);

// inventors 年齡總和
// const newData = inventors.reduce((accumulator, inventor) => {
//   return accumulator + (inventor.passed - inventor.year);
// }, 0);
// console.table(newData);

// 計算陣列中總數，陣列中的物品都是不知道的。
const data = [
  'car',
  'car',
  'truck',
  'truck',
  'bike',
  'walk',
  'car',
  'van',
  'bike',
  'walk',
  'car',
  'van',
  'car',
  'truck',
];
const newData = data.reduce((accumulator, item) => {
  if (!accumulator[item]) accumulator[item] = 0;
  accumulator[item]++;
  return accumulator;
}, {});
console.table(newData);
