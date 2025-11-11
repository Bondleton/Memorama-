import Button from "./Button";
import Card from "./Card";
import arrCardsRand from "../logic/createArrCardsRand";
import React, { useEffect, useState } from "react";

import io from "socket.io-client";
import convertToTimer from "../logic/convertTimer";

export default function GameScreen(props) {
  // Variables de estado
  const [cardsArr, setCardsArr] = useState([]);
  const [moves, setMoves] = useState(0);
  const [selected, setSelected] = useState(0);

  //Llamar a funcion aleatorio
  useEffect(() => {
    setCardsArr(arrCardsRand(props.numCards));
  }, [props.numCards]);

  // 🔹 Función para rotar carta
  const rotate = (id, pinUp) => {
    if (pinUp === 0) {
      setCardsArr((prevArr) => {
        const newArr = [...prevArr];
        newArr[id].rotate = true;
        newArr[id].validating = 1;
        return newArr;
      });
      setTimeout(() => validate(), 500);
    }
  };

  // 🔹 Validar si hay pareja
  const validate = () => {
    setMoves((m) => m + 1);
    const validatingCards = cardsArr.filter((c) => c.validating === 1);

    if (validatingCards.length === 2) {

      // elementos distintos, retornamos
      if (validatingCards[0].bind !== validatingCards[1].bind) {
        setCardsArr((prevArr) => {
          const newArr = [...prevArr];
          validatingCards.forEach((card) => {
            newArr[card.id].rotate = false;
            newArr[card.id].validating = 0;
          });
          return newArr;
        });
      } else {
        setCardsArr((prevArr) => {
          const newArr = [...prevArr];
          validatingCards.forEach((card) => {
            newArr[card.id].pinUp = 1;
            newArr[card.id].validating = 0;
          });
          return newArr;
        });
      }
    }

    if (cardsArr.filter((c) => c.pinUp === 0).length === 0) {
      props.setFinish(2);
    }
  };

  // 🔌 Conexión WebSocket con Socket.io
  useEffect(() => {
    const socket = io("http://172.31.3.97:3000");

    socket.on("buttonPress", (data) => {
      if (data.state !== "1") return;

      switch (data.button) {
        case "UP":
          setSelected((s) => (s > 0 ? s - 1 : cardsArr.length - 1));
          break;
        case "DOWN":
          setSelected((s) => (s < cardsArr.length - 1 ? s + 1 : 0));
          break;
        case "OK":
          rotate(selected, cardsArr[selected].pinUp);
          break;
        case "RESET":
          props.setRestart();
          break;
        default:
          break;
      }
    });

    return () => socket.disconnect();
  }, [cardsArr, selected]);

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
        {cardsArr
          .sort((a, b) => a.id - b.id)
          .map((card, index) => (
            <div
              key={card.id}
              className={`p-1 ${index === selected
                ? "border-4 border-green-400 rounded-xl"
                : "border border-transparent"
                }`}
            >
              <Card
                id={card.id}
                rotate={card.rotate}
                symbol={card.symbol}
                pinUp={card.pinUp}
                bind={card.bind}
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