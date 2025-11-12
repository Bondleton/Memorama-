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

  // Inicializar cartas aleatorias
  useEffect(() => {
    setCardsArr(arrCardsRand(props.numCards));
  }, [props.numCards]);

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
          rotate(selected, cardsArr[selected]?.pinUp);
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
          <p>Movements: {moves}</p>
        </div>
        <div className="gamescreen--moves">
          <p className="text-right">Time: {convertToTimer(props.time)}</p>
        </div>
      </div>

      <div className="gamescreen--cards grid grid-4">
        {cardsArr.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            rotate={card.rotate}
            symbol={card.symbol}
            bind={card.bind}
            set={card.set}
            actionRotate={rotate}
            pinUp={card.pinUp}
          />
        ))}
      </div>

      <div className="text-center mt-4">
        <Button label="Reiniciar juego" action={props.setRestart} />
      </div>
    </div>
  );
}
