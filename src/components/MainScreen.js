import Button from "./Button";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function MainScreen(props) {
    const levelText = [
        { text: 'Fácil', emoji: '⭐'},
        { text: 'Media', emoji: '⭐⭐'},
        { text: 'Difícil', emoji: '⭐⭐⭐'}
    ];

    const [menuSelection, setMenuSelection] = useState(0);
    const [socketStatus, setSocketStatus] = useState('disconnected');
    const currentLevel = levelText[props.level];
    const currentSubject = props.subjectsData[props.subject];

    // 🔌 Conexión WebSocket mejorada
    useEffect(() => {
        console.log("🔄 Iniciando conexión WebSocket...");
        
        const socket = io("http://localhost:3001", {
            transports: ['websocket', 'polling'],
            timeout: 10000,
            forceNew: true
        });

        socket.on("connect", () => {
            console.log("✅ CONECTADO al servidor WebSocket");
            setSocketStatus('connected');
        });

        socket.on("welcome", (data) => {
            console.log("👋 Mensaje de bienvenida:", data);
        });

        socket.on("buttonPress", (data) => {
            console.log("🎮 Botón recibido:", data);
            
            if (data.state !== "1") return;

            switch (data.button) {
                case "UP":
                    setMenuSelection(prev => prev > 0 ? prev - 1 : 2);
                    break;
                case "DOWN":
                    setMenuSelection(prev => prev < 2 ? prev + 1 : 0);
                    break;
                case "LEFT":
                    if (menuSelection === 0) {
                        props.changeSubject();
                    } else if (menuSelection === 1) {
                        props.changeDifficulty();
                    }
                    break;
                case "RIGHT":
                    if (menuSelection === 0) {
                        props.changeSubject();
                    } else if (menuSelection === 1) {
                        props.changeDifficulty();
                    }
                    break;
                case "OK":
                    if (menuSelection === 2) {
                        props.setStart(1);
                    } else if (menuSelection === 0) {
                        props.changeSubject();
                    } else if (menuSelection === 1) {
                        props.changeDifficulty();
                    }
                    break;
                default:
                    break;
            }
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ DESCONECTADO:", reason);
            setSocketStatus('disconnected');
        });

        socket.on("connect_error", (error) => {
            console.log("❌ ERROR de conexión:", error.message);
            setSocketStatus('error');
        });

        // Intentar reconexión manual después de 5 segundos
        const reconnectInterval = setInterval(() => {
            if (!socket.connected) {
                console.log("🔄 Intentando reconectar...");
                socket.connect();
            }
        }, 5000);

        return () => {
            console.log("🧹 Limpiando conexión WebSocket");
            clearInterval(reconnectInterval);
            socket.disconnect();
        };
    }, [menuSelection, props]);

    return (
        <div className='mainscreen text-center'>
            <h1 className='mainscreen--title'>Memorama 🧠</h1>
            
            {/* Indicador de estado de conexión */}
            <div className={`connection-status ${socketStatus}`}>
                {socketStatus === 'connected' && '🟢 Conectado al joystick'}
                {socketStatus === 'disconnected' && 'Conectado al joystick'}
                {socketStatus === 'error' && '⚠️ Error de conexión'}
            </div>

            <div className='mainscreen--menu'>
                
                {/* Selector de Materia */}
                <p>Elige una materia 📚</p>
                <div className={`mainscreen--level-selector ${menuSelection === 0 ? 'selected-menu-item' : ''}`}>
                    <span className="mainscreen--arrow">◀️</span>
                    <Button
                        label={`${currentSubject.emoji} ${currentSubject.name}`}
                        action={() => {}}
                    />
                    <span className="mainscreen--arrow">▶️</span>
                </div>
                
                {/* Selector de Nivel */}
                <p>Selecciona el nivel 📊 </p>
                <div className={`mainscreen--level-selector ${menuSelection === 1 ? 'selected-menu-item' : ''}`}>
                    <span className="mainscreen--arrow">◀️</span>
                    <Button
                        label={`${currentLevel.emoji} ${currentLevel.text}`}
                        action={() => {}}
                    />
                    <span className="mainscreen--arrow">▶️</span>
                </div>                
                
                {/* Botón Jugar */}
                <div className={menuSelection === 2 ? 'selected-menu-item' : ''}>
                    <Button 
                        label="🎮 ¡A jugar!" 
                        action={() => props.setStart(1)} 
                    />
                </div>
            </div>
            <p>Proyecto IoT + <span className='logo-react'><i className="fab fa-react"></i></span></p>
            <p className="instruction-small">Usa el joystick para navegar y el botón OK para seleccionar</p>
        </div>
    );
}