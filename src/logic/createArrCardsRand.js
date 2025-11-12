import symbols from "./symbols";

export default function arrCardsRand(numCards) {
  const halfCards = numCards / 2;
  const arr = [];

  // Crear pares de cartas
  for (let i = 0; i < halfCards; i++) {
    const card1 = {
      id: arr.length,
      symbol: symbols[i],
      bind: i,
      rotate: false,
      validating: 0,
      pinUp: 0,
    };
    const card2 = {
      id: arr.length + 1,
      symbol: symbols[i],
      bind: i,
      rotate: false,
      validating: 0,
      pinUp: 0,
    };
    arr.push(card1, card2);
  }

  // Mezclar las cartas aleatoriamente
  return arr.sort(() => Math.random() - 0.5);
}


// export default function arrCardsRand(numCards) {
//   const halfCards = numCards / 2;
//   const arr = [];
//   let i = 0, j = 0
//   while (i < numCards) {
//     if (j === halfCards) i = 0
//     let ramdom = Math.floor(Math.random() * numCards);

//     if (!arr.some(item => item.id === ramdom)) {
//       arr.push({
//         id: arr.length + 1,
//         symbol: symbols[i],
//         bind: i,
//         rotate: false,
//         validating: 0,
//         set: 0,
//       })
//       i++
//       j++
//     }

//   }
//   return arr
// }
