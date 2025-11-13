import Button from "./Button";
import Card from "./Card";
import arrCardsRand from "../logic/createArrCardsRand";
import React, { useEffect, useState } from "react";

import io from "socket.io-client";
import convertToTimer from "../logic/convertTimer";

export default function GameScreen(props) {
  const [cardsArr, setCardsArr] = useState([]);
  const [moves, setMoves] = useState(0);
  const [selected, setSelected] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [showAllCards, setShowAllCards] = useState(true);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(3);

  // Inicializar cartas aleatorias
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

  // Función para rotar carta
  const rotate = (id, pinUp) => {
    // Si está en modo preview, validando o la carta ya está levantada, no hacer nada
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

  // Función para validar pares
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

  // 🔌 Conexión WebSocket
  useEffect(() => {
    const socket = io("http://172.31.3.97:3000");

    socket.on("buttonPress", (data) => {
      if (data.state !== "1") return;
      if (showAllCards || isValidating) return;

      switch (data.button) {
        case "UP":
          setSelected((s) => (s > 0 ? s - 1 : cardsArr.length - 1));
          break;
        case "DOWN":
          setSelected((s) => (s < cardsArr.length - 1 ? s + 1 : 0));
          break;
        case "OK":
          if (cardsArr[selected]) {
            rotate(selected, cardsArr[selected].pinUp);
          }
          break;
        case "RESET":
          props.setRestart();
          break;
        default:
          break;
      }
    });

    return () => socket.disconnect();
  }, [cardsArr, selected, isValidating, showAllCards]);

  return (
    <div className="gamescreen">
      <div className="gamescreen--score grid grid-2">
        <div className="gamescreen--moves">
          <h2>Movimientos: {moves}</h2>
        </div>
        <div className="gamescreen--moves">
          <h2 className="text-right">Tiempo: {convertToTimer(props.time)}</h2>
        </div>
      </div>

      {/* Información de la materia actual */}
      <div className="text-center mb-4">
        <h1 className="card--subject">
          {props.subject.emoji} {props.subject.name}
        </h1>
        <p className="instruction">
          {showAllCards ? "🎯 Memoriza las posiciones..." : "Empareja las preguntas con sus respuestas"}
        </p>
        
        {/* Contador regresivo funcional */}
        {showAllCards && (
          <div className="preview-timer">
            <div className="countdown">
              ⏱️ Las cartas se voltearán en {previewTimeLeft}s
            </div>
          </div>
        )}
      </div>

      <div className="gamescreen--cards grid grid-4">
        {cardsArr.map((card, index) => (
          <div
            key={card.id}
            className={`p-1 ${
              index === selected && !showAllCards
                ? "border-4 border-green-400 rounded-xl"
                : "border border-transparent"
            }`}
          >
            <Card
              id={card.id}
              rotate={showAllCards ? true : card.rotate}
              symbol={card.symbol}
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

      <div className="text-center mt-4">
        <Button 
          label={showAllCards ? "⏳ Preparando..." : "Reiniciar juego"} 
          action={props.setRestart}
          disabled={showAllCards}
        />
      </div>
    </div>
  );
}