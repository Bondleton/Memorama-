import Button from "./Button";

export default function FinishScreen(props) {
  return (
    <div className='text-center'>
        <h1 className='finishscreen--title'>¡GANASTE! ⭐⭐⭐</h1>
        <div className="finishscreen">
        <p className="text-lg">¡Completaste todo el memorama! 🎯</p>

        <Button label="🎮 ¡Jugar otra vez!" action={props.setRestart}/>
        </div>
    </div>
  );
}