import React, { useEffect } from "react";
import Button from "./Button";
import { io } from "socket.io-client";

export default function FinishScreen(props) {

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("buttonPress", (data) => {
      if (data.state !== "1") return;
      if (data.button === "OK") {
        props.setRestart();
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="text-center">
      <h1 className="finishscreen--title">¡GANASTE! ⭐⭐⭐</h1>

      <div className="finishscreen">
        <p className="text-lg">¡Completaste todo el memorama! 🎯</p>

        <div
          className="border-4 border-green-400 rounded-xl p-2 mt-4 inline-block"
        >
          <Button label="🎮 ¡Jugar otra vez!" action={props.setRestart} />
        </div>
      </div>
    </div>
  );
}
