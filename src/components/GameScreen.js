import React, { useEffect, useState } from "react";
import Button from "./Button";
import Card from "./Card";
import arrCardsRand from "../logic/createArrCardsRand";
import io from "socket.io-client";
import convertToTimer from "../logic/convertTimer";

export default function GameScreen(props) {
  const [cardsArr, setCardsArr] = useState([]);
  const [moves, setMoves] = useState(0);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [showAllCards, setShowAllCards] = useState(true);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(3);

  // Determinar la clase CSS según el número de cartas
  const getGridClass = () => {
    const numCards = cardsArr.length;
    if (numCards === 8) return "grid-4-8";
    if (numCards === 16) return "grid-4-16";
    if (numCards === 24) return "grid-6-24";
    return "grid-4-8";
  };

  useEffect(() => {
    const newCards = arrCardsRand(props.numPairs, props.subject);
    setCardsArr(newCards);
    
    setShowAllCards(true);
    setPreviewTimeLeft(3);
    
    const interval = setInterval(() => {
      setPreviewTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowAllCards(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.numPairs, props.subject]);

  const rotate = (id, pinUp) => {
    if (showAllCards || isValidating || pinUp === 1) return;

    setCardsArr((prevArr) => {
      const newArr = [...prevArr];
      const index = newArr.findIndex((card) => card.id === id);
      if (index !== -1) {
        newArr[index].rotate = true;
        newArr[index].validating = 1;
      }
      return newArr;
    });

    setTimeout(() => validate(), 600);
  };

  const validate = () => {
    if (showAllCards) return;

    const validatingCards = cardsArr.filter((c) => c.validating === 1);
    if (validatingCards.length < 2) return;

    setIsValidating(true);
    setMoves((m) => m + 1);

    if (validatingCards[0].bind !== validatingCards[1].bind) {
      setTimeout(() => {
        setCardsArr((prevArr) => {
          const newArr = [...prevArr];
          validatingCards.forEach((card) => {
            const index = newArr.findIndex((c) => c.id === card.id);
            if (index !== -1) {
              newArr[index].rotate = false;
              newArr[index].validating = 0;
            }
          });
          return newArr;
        });
        setIsValidating(false);
      }, 800);
    } else {
      setCardsArr((prevArr) => {
        const newArr = [...prevArr];
        validatingCards.forEach((card) => {
          const index = newArr.findIndex((c) => c.id === card.id);
          if (index !== -1) {
            newArr[index].pinUp = 1;
            newArr[index].validating = 0;
          }
        });

        if (newArr.every((c) => c.pinUp === 1)) {
          setTimeout(() => props.setFinish(2), 1000);
        }

        return newArr;
      });
      setTimeout(() => setIsValidating(false), 500);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("buttonPress", (data) => {
      if (data.state !== "1") return;
      if (showAllCards || isValidating) return;

      const total = cardsArr.length;
      const btn = data.button;

      switch (btn) {
        case "UP":
          if (cursorIndex === total) {
            setCursorIndex(Math.max(0, total - (total === 24 ? 6 : 4)));
          } else {
            setCursorIndex((i) => {
              if (total === 24) {
                return i - 6 >= 0 ? i - 6 : i;
              } else {
                return i - 4 >= 0 ? i - 4 : i;
              }
            });
          }
          break;

        case "DOWN":
          if (cursorIndex + (total === 24 ? 6 : 4) >= total) {
            setCursorIndex(total);
          } else {
            setCursorIndex((i) => i + (total === 24 ? 6 : 4));
          }
          break;

        case "LEFT":
          if (cursorIndex !== total) {
            setCursorIndex((i) => (i > 0 ? i - 1 : i));
          }
          break;

        case "RIGHT":
          if (cursorIndex !== total) {
            setCursorIndex((i) => (i < total - 1 ? i + 1 : i));
          }
          break;

        case "OK":
          if (cursorIndex === total) {
            props.setRestart();
            return;
          }
          const card = cardsArr[cursorIndex];
          if (card && card.pinUp !== 1) {
            rotate(card.id, card.pinUp);
          }
          break;
      }
    });

    return () => socket.disconnect();
  }, [cursorIndex, cardsArr, showAllCards, isValidating, props]);

  return (
    <div className="gamescreen">
  <div className="gamescreen--header">
    <div className="gamescreen--score-grid">
      <div className="gamescreen--moves">
        <h2>Movimientos: {moves}</h2>
      </div>
      
      <div className="gamescreen--center-content">
        <h1 className="card--subject">
          {props.subject.emoji} {props.subject.name}
        </h1>
        <p className="instruction">
          {showAllCards
            ? "🎯 Memoriza las posiciones..."
            : "Empareja las preguntas con sus respuestas"}
        </p>

        {showAllCards && (
          <div className="preview-timer">
            <div className="countdown">
              ⏱️ Las cartas se voltearán en {previewTimeLeft}s
            </div>
          </div>
        )}
      </div>
      
      <div className="gamescreen--time">
        <h2>Tiempo: {convertToTimer(props.time)}</h2>
      </div>
    </div>
  </div>

      {/* <div className="text-center mb-4">
        <h1 className="card--subject">
          {props.subject.emoji} {props.subject.name}
        </h1>
        <p className="instruction">
          {showAllCards
            ? "🎯 Memoriza las posiciones..."
            : "Empareja las preguntas con sus respuestas"}
        </p>

        {showAllCards && (
          <div className="preview-timer">
            <div className="countdown">
              ⏱️ Las cartas se voltearán en {previewTimeLeft}s
            </div>
          </div>
        )}
      </div> */}

      {/* Contenedor flexible para las cartas */}
      <div className="gamescreen--cards-container">
        <div className={`gamescreen--cards ${getGridClass()}`}>
          {cardsArr.map((card, index) => (
            <div
              key={card.id}
              className={`p-1 ${
                index === cursorIndex && !showAllCards
                  ? "border-4 border-green-400 rounded-xl"
                  : "border border-transparent"
              }`}
            >
              <Card
                id={card.id}
                rotate={showAllCards ? true : card.rotate}
                content={card.content}
                emoji={card.emoji}
                type={card.type}
                bind={card.bind}
                pinUp={card.pinUp}
                actionRotate={rotate}
                isPreview={showAllCards}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Área del botón reiniciar */}
      <div className="gamescreen--restart">
        <div
          className={`text-center ${
            cursorIndex === cardsArr.length
              ? "border-4 border-green-400 rounded-xl p-2"
              : ""
          }`}
        >
          <Button
            label={showAllCards ? "⏳ Preparando..." : "🔄 Reiniciar juego"}
            action={props.setRestart}
            disabled={showAllCards}
          />
        </div>

        {!showAllCards && (
          <div className="text-center mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              🎮 Usa el joystick: ⬆️⬇️⬅️➡️ para navegar • OK para seleccionar
              {cardsArr.length === 24 && " • ⬆️⬇️ mueven 6 posiciones"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}