export default function arrCardsRand(numPairs, subjectData) {
  const availablePairs = subjectData.pairs.slice(0, numPairs);
  const arr = [];

  // Crear pares de preguntas y respuestas
  for (let i = 0; i < availablePairs.length; i++) {
    const pair = availablePairs[i];
    
    // Carta de pregunta
    const card1 = {
      id: arr.length,
      type: 'question',
      content: pair.question,
      emoji: pair.questionEmoji,
      bind: i,
      rotate: false,
      validating: 0,
      pinUp: 0,
    };
    
    // Carta de respuesta
    const card2 = {
      id: arr.length + 1,
      type: 'answer',
      content: pair.answer,
      emoji: pair.answerEmoji,
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