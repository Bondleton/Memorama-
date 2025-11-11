import Button from './Button'

export default function MainScreen(props) {

    const levelText = [
        { text: 'Fácil', emoji: '⭐', desc: '8 cartas' },      // 1 estrella
        { text: 'Media', emoji: '⭐⭐', desc: '16 cartas' },     // 2 estrellas
        { text: 'Difícil', emoji: '⭐⭐⭐', desc: '24 cartas' }  // 3 estrellas
    ];

    const currentLevel = levelText[props.level];

    return (
        <div className='mainscreen text-center'>
            <h1 className='mainscreen--title'>Memorama 🧠</h1>
            <div className='mainscreen--menu'>
                <p>Seleccionar nivel 📊</p>
                {/* <p className='text-sm text-gray-600 mb-2'>
                    Nivel con: {currentLevel.emoji} {currentLevel.desc}
                </p> */}
                <Button
                    label={`${levelText[props.level].emoji} ${levelText[props.level].text}`}
                    action={props.changeDifficulty}
                /> <br />
                <Button label="🎮 ¡A jugar!" action={() => props.setStart(1)} />
            </div>
            <p>Proyecto IoT + <span className='logo-react'><i className="fab fa-react"></i></span></p>
        </div>
    )
}
