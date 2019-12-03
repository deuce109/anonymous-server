// require("isomorphic-fetch");

// let randomString = () => {
//   return (
//     Math.random()
//       .toString(36)
//       .substring(2, 15) +
//     Math.random()
//       .toString(36)
//       .substring(2, 15)
//   );
// };

// for (i = 0; i < 100; i++) {
//   let data = {};
//   let dataElements = Math.round(Math.random() * 10);
//   console.log(dataElements);
//   for (x = 0; x < dataElements; x++) {
//     let key = randomString();
//     console.log(key);
//     data[key] = randomString();
//   }
//   fetch("http://localhost:3030/test/objects", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     }
//   });
// }

console.log(typeof "test");
console.log(typeof 1);
console.log(typeof {});
console.log(typeof []);
console.log(typeof true);
console.log(typeof Date.now());
