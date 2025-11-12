import Button from './Button'

export default function MainScreen(props) {
    const levelText = [
        { text: 'Fácil', emoji: '⭐', desc: '8 cartas' },
        { text: 'Media', emoji: '⭐⭐', desc: '16 cartas' },
        { text: 'Difícil', emoji: '⭐⭐⭐', desc: '24 cartas' }
    ];

    const currentLevel = levelText[props.level];

    return (
        <div className='mainscreen text-center'>
            <h1 className='mainscreen--title'>Memorama 🧠</h1>
            <div className='mainscreen--menu'>
                <p>Seleccionar nivel 📊</p>

                <div className="mainscreen--level-selector">
                    <span
                        className="mainscreen--arrow"
                    // onClick={props.changeDifficulty}
                    >
                        ◀️
                    </span>
                    <div className="">
                        <Button
                            label={`${currentLevel.emoji} ${currentLevel.text}`}
                            action={props.changeDifficulty}
                        />
                    </div>
                    <span
                        className="mainscreen--arrow"
                    // onClick={props.changeDifficulty}
                    >
                        ▶️
                    </span>
                </div>

                <Button label="🎮 ¡A jugar!" action={() => props.setStart(1)} />
            </div>
            <p>Proyecto IoT + <span className='logo-react'><i className="fab fa-react"></i></span></p>
        </div>
    )
}