import Button from './Button'

export default function MainScreen(props) {
    const levelText = [
        { text: 'Fácil', emoji: '⭐'},
        { text: 'Media', emoji: '⭐⭐'},
        { text: 'Difícil', emoji: '⭐⭐⭐'}
    ];

    const currentLevel = levelText[props.level];
    const currentSubject = props.subjectsData[props.subject];

    return (
        <div className='mainscreen text-center'>
            <h1 className='mainscreen--title'>Memorama 🧠</h1>
            <div className='mainscreen--menu'>
                
                {/* Selector de Materia */}
                <p>Elige una materia 📚</p>
                <div className="mainscreen--level-selector">
                    <span 
                        className="mainscreen--arrow" 
                        // onClick={props.changeSubject}
                    >
                        ◀️
                    </span>
                    <Button
                        label={`${currentSubject.emoji} ${currentSubject.name}`}
                        action={props.changeSubject}
                    />
                    <span 
                        className="mainscreen--arrow" 
                        // onClick={props.changeSubject}
                    >
                        ▶️
                    </span>
                </div>
                
                {/* Selector de Nivel */}
                <p>Selecciona el nivel 📊 </p>
                <div className="mainscreen--level-selector">
                    <span 
                        className="mainscreen--arrow" 
                        // onClick={props.changeDifficulty}
                    >
                        ◀️
                    </span>
                    <Button
                        label={`${currentLevel.emoji} ${currentLevel.text}`}
                        action={props.changeDifficulty}
                    />
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