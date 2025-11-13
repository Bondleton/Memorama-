import MainScreen from "./components/MainScreen"; 
import GameScreen from "./components/GameScreen"
import React, { useState } from "react";
import FinishScreen from "./components/FinishScreen";
import questionsData from "./logic/questionsData";

function App() {
  // VARIABLES DE ESTADO
  const [stateGame, setStateGame] = useState(0)
  const [level, setLevel] = useState(0)
  const [subject, setSubject] = useState("matemáticas")

  // OBJETO CON NUMERO DE PARES SEGUN NIVEL
  const pairsByLevel = { 
    0: 4,  // 8 cartas = 4 pares
    1: 8,  // 16 cartas = 8 pares  
    2: 12  // 24 cartas = 12 pares
  }

  // CAMBIAR DIFICULTAD
  const changeDifficulty = () =>{
    setLevel( level === 2 ? 0 : level + 1)
  }

  // CAMBIAR MATERIA
  const changeSubject = () =>{
    setSubject( subject === "matemáticas" ? "inglés" : "matemáticas")
  }

  // CAMBIAR EL ESTADO DE JUEGO
  const changeStateGame = ( value ) =>{
    setStateGame(value)
    if( value === 1) playTimer()
  }

  // REINICIAR EL JUEGO
  const restartGame = () => {
    setStateGame(0)
    setLevel(0)
    setSubject("matemáticas")
    resetTimer()
  }

  // CONTADOR DE TIEMPO
  const [intervalId, setIntervalId] = useState(0);
  const [mainMiliseconds, setMainMiliseconds] = useState(0);
  const playTimer = () => { 
    if(intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
    
    const newIntervalId = setInterval( () =>{
      setMainMiliseconds( mainMiliseconds => mainMiliseconds + 1000 )
    }, 1000)
    
    setIntervalId(newIntervalId);
  }

  const resetTimer = () =>{
    setMainMiliseconds(0)
    if(intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
  }

  return (
    <div className="container middle">
      { 
        stateGame === 0 ?
        <MainScreen 
          setStart={changeStateGame} 
          level={level} 
          changeDifficulty={changeDifficulty}
          subject={subject}
          changeSubject={changeSubject}
          subjectsData={questionsData}
        /> : stateGame === 1 ?
        <GameScreen 
          numPairs={pairsByLevel[level]} // Cambiado de numCards a numPairs
          setRestart = {restartGame}
          setFinish={changeStateGame} 
          time={mainMiliseconds}
          subject={questionsData[subject]}
        /> : <FinishScreen setRestart={restartGame} />
      }
    </div>
  );
}

export default App;