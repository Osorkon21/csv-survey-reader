// function filterMostlyNumbers(arr: string[]): string[] {
//   return arr.filter((item) => {
//     const letterCount = item.replace(/[^a-zA-Z]/g, '').length;
//     const digitCount = item.replace(/[a-zA-Z]/g, '').length;
//     return letterCount >= digitCount;
//   });
// }
// const arr1 = ['abc123', '456789', 'def345', '123456'];
// const filteredArr1 = filterMostlyNumbers(arr1);
// console.log(filteredArr1); // ['abc123', 'def345']
// function rejectDateAndTime(arr: string[]): string[] {
//   return arr.filter((item) => !/^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}\s[AP]M$/.test(item));
// }
// const arr = ['11/08/2023 05:15:48 PM', 'Hello world', '10/15/2022 10:00:00 AM'];
// const filteredArr = rejectDateAndTime(arr);
// console.log(filteredArr); // ['Hello world']
// import * as fs from 'fs';
// import readline from 'readline';
// const readFile = async (filePath: string): Promise<void> => {
//   const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
//   const lineReader = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity,
//   });
//   const seenValues = new Set<string>();
//   for await (const line of lineReader) {
//     const values = line.split(',');
//     const valueToEliminate = values[0]; // assuming the value to eliminate is in the first column
//     if (!seenValues.has(valueToEliminate)) {
//       // This value hasn't been seen before, so keep it
//       console.log(line);
//       seenValues.add(valueToEliminate);
//     }
//   }
// };
function factorial(n) {
    if (n === 0) {
        return 1;
    }
    else {
        return n * factorial(n - 1);
    }
}
console.log(factorial(400)); // output: 720
