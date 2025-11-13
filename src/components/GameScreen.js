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
  const [isValidating, setIsValidating] = useState(false); // 🔒 bloquea jugadas

  // Inicializar cartas aleatorias - ACTUALIZADO
  useEffect(() => {
    setCardsArr(arrCardsRand(props.numPairs, props.subject));
  }, [props.numPairs, props.subject]);

  // Función para rotar carta
  const rotate = (id, pinUp) => {
    // Si está validando o la carta ya está levantada, no hacer nada
    if (isValidating || pinUp === 1) return;

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
    const validatingCards = cardsArr.filter((c) => c.validating === 1);
    if (validatingCards.length < 2) return;

    setIsValidating(true); // Bloquear mientras se compara

    setMoves((m) => m + 1);

    if (validatingCards[0].bind !== validatingCards[1].bind) {
      // No son iguales
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
        setIsValidating(false); //Desbloquear después de animación
      }, 800);
    } else {
      // Son iguales
      setCardsArr((prevArr) => {
        const newArr = [...prevArr];
        validatingCards.forEach((card) => {
          const index = newArr.findIndex((c) => c.id === card.id);
          if (index !== -1) {
            newArr[index].pinUp = 1;
            newArr[index].validating = 0;
          }
        });

        // Si todas las cartas están arriba, ganar después de 1s
        if (newArr.every((c) => c.pinUp === 1)) {
          setTimeout(() => props.setFinish(2), 1000);
        }

        return newArr;
      });
      setTimeout(() => setIsValidating(false), 500); // Pequeño delay antes de desbloquear
    }
  };

  // 🔌 Conexión WebSocket con Socket.io
  useEffect(() => {
    const socket = io("http://172.31.3.97:3000");

    socket.on("buttonPress", (data) => {
      if (data.state !== "1") return;
      if (isValidating) return; // No permitir acciones durante validación

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
  }, [cardsArr, selected, isValidating]);

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
          Empareja las preguntas con sus respuestas
        </p>
      </div>

      <div className="gamescreen--cards grid grid-4">
        {cardsArr.map((card, index) => (
          <div
            key={card.id}
            className={`p-1 ${
              index === selected
                ? "border-4 border-green-400 rounded-xl"
                : "border border-transparent"
            }`}
          >
            <Card
              id={card.id}
              rotate={card.rotate}
              symbol={card.symbol} // Mantener por compatibilidad, pero ya no se usará
              content={card.content} // Nueva prop
              emoji={card.emoji}    // Nueva prop
              type={card.type}      // Nueva prop
              bind={card.bind}
              pinUp={card.pinUp}
              actionRotate={rotate}
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Button label="Reiniciar juego" action={props.setRestart} />
      </div>
    </div>
  );
}