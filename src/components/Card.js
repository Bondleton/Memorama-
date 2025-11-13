export default function Card(props) {
    return (
        <div 
            className={`card ${props.rotate ? 'rotate': ''} ${props.isPreview ? 'preview-mode' : ''}`}
            data-id={props.id} 
            onClick={ () => props.actionRotate(props.id, props.pinUp) } 
            data-bind={props.bind}
            data-type={props.type}
        >
            <div className='card--inner'>
                <div className='card--front middle'>
                    <i className="fas fa-question"></i>
                </div>
                <div className='card--back middle'>
                    <div className="card-content">
                        <div className="card-emoji">{props.emoji}</div>
                        <div className="card-text">{props.content}</div>
                        <div className="card-type-badge">
                            {props.type === 'question' ? '❓ Pregunta' : '✅ Respuesta'}
                        </div>
                        {props.isPreview && (
                            <div className="preview-indicator">👀</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}