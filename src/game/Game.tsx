import { useState } from "react";
import { Link } from "react-router-dom";
import { newGame, joinGame, getCurrentGame, 
        distributeCards, drawCard, playCard, toggleTurn, playAgain } from "./gameServices.ts";
import Input from "../common_components/Input.tsx"
import Button from "../common_components/Button.tsx"
import Hand from "./Hand.tsx";
import Scoreboard from "./Scoreboard.tsx";

export default function Game() {
    let gameId: string = ""

    // ¿El jugador actual es el jugador 1?
    let is1CurrentPlayer: boolean = true

    // Valor del input donde se ingresa el número (id) de partida para unirse
    const [gameNumberInput, setGameNumberInput] = useState("")

    // Label donde aparece el número (id) de la partida actual
    const [gameNumberOutput, setGameNumberOutput] = useState("")

    // Mano superior (la del oponente)
    const [otherPlayersHand, setOtherPlayersHand] = useState(Array(108).fill(null))

    // Pila desde la cual se reparten/roban cartas
    const [drawCardPile, setDrawCardPile] = useState(Array(108).fill(null))

    // Pila donde se colocan las cartas a jugar
    const [playedCardsPile, setPlayedCardsPile] = useState(Array(108).fill(null))

    // Mano inferior (la propia)
    const [currentPlayersHand, setCurrentPlayersHand] = useState(Array(108).fill(null))

    // Número del jugador del cual es el turno
    const [turn, setTurn] = useState("1")

    // ¿Se repartieron ya las cartas iniciales?
    const [cardsDistributed, setCardsDistributed] = useState(false)

    // Establece las cartas del jugador actual y del oponente de acuerdo a quién es 1 y 2
    const setPlayersHands = (response) => {
        if (is1CurrentPlayer) {
            setCurrentPlayersHand(response.player_1_hand)
            setOtherPlayersHand(response.player_2_hand)
        } else {
            setCurrentPlayersHand(response.player_2_hand)
            setOtherPlayersHand(response.player_1_hand)
        }
    }

    // Verifica cada segundo el turno y las cartas de la partida actual
    const checkGameStatus = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let interval = setInterval(() => {
            getCurrentGame(gameId).then(function (response) {
                setTurn(response.turn);
                setDrawCardPile(response.draw_card_pile)
                setPlayedCardsPile(response.played_cards_pile)
                
                setPlayersHands(response)
            });
        }, 1000);
    }

    // Cambia el turno del jugador ya sea manual o automáticamente
    const changeTurn = () => {
        toggleTurn(gameNumberOutput).then(function (response) {
            console.log(response)
            setTurn(response.turn)
        })
    }

    // Crear una nueva partida
    const handleNewGameClick = () => {
        // Que gameNumberOutput tenga un valor implica que ya se estaba jugando en este browser
        if (gameNumberOutput) {
            alert("Debes reiniciar antes de comenzar una nueva partida.");
            return;
        }

        newGame().then(function (response) {
            console.log(response)
            gameId = response.id
            setGameNumberOutput(gameId)
            setTurn(response.turn)
            setOtherPlayersHand(response.player_2_hand)
            setDrawCardPile(response.draw_card_pile)
            setPlayedCardsPile(response.played_cards_pile)
            setCurrentPlayersHand(response.player_1_hand)
        })

        // El jugador 1 es quien crea la partida
        is1CurrentPlayer = true
        checkGameStatus()
    }

    // Unirse a una partida existente
    const handleJoinGameClick = () => { 
        if (gameNumberOutput) {
            alert("Debes reiniciar antes de unirte a una nueva partida.");
            return;
        }

        if (!gameNumberInput) {
            alert("Por favor ingresa un número de partida para poder unirte a una.");
            return;
        }

        gameId = gameNumberInput

        joinGame(gameId).then(function (response) {
            console.log(response);
            gameId = response.id
            setGameNumberOutput(gameId)
            setTurn(response.turn)
            setOtherPlayersHand(response.player_1_hand)
            setDrawCardPile(response.draw_card_pile)
            setPlayedCardsPile(response.played_cards_pile)
            setCurrentPlayersHand(response.player_2_hand)
        });

        // El jugador 2 es quien se une a la partida
        is1CurrentPlayer = false

        // No se permite que el jugador 2 reparta las cartas, solo que robe
        setCardsDistributed(true)
        checkGameStatus()
    }

    const handleCardPlayed = (i) => {
        // Obtiene el primer caracter de la carta jugada para verificar si es un número        
        let playedCardFirstChar: string = currentPlayersHand[i].charAt(0)

        playCard(gameNumberOutput, i).then(function (response) {
            console.log(response)
            setPlayedCardsPile(response.played_cards_pile)

            setPlayersHands(response)
        })

        // Si la carta era numérica, se cambia de turno automáticamente
        switch(playedCardFirstChar) {
            case '0': case '1': case '2': case '3': case '4': 
            case '5': case '6': case '7': case '8': case '9': {
                changeTurn()
                break
            }
        }
    }

    const handleCardDrew = () => {
        /* Si las cartas ya fueron repartidas, se roba una carta; sino se reparten 7 a cada uno
        y se deja una en juego */
        if (cardsDistributed) {
            
            drawCard(gameNumberOutput).then(function (response) {
                console.log(response)
                setDrawCardPile(response.draw_card_pile)
                
                setPlayersHands(response)
            })

        } else {

            distributeCards(gameNumberOutput).then(function (response) {
                console.log(response)
                setDrawCardPile(response.draw_card_pile)
                setPlayedCardsPile(response.played_cards_pile)
                
                setPlayersHands(response)
            })

            setCardsDistributed(true)
        }
    }

    // Comenzar una nueva "ronda" en la partida
    const handleRestartClick = () => {
        if (!gameNumberOutput) {
            alert("Debes estar en una partida para poder jugar una nueva ronda.")
            return
        }

        playAgain(gameNumberOutput).then(function (response) {
            console.log(response)
            setDrawCardPile(response.draw_card_pile)
            setPlayedCardsPile(response.played_cards_pile)
                
            setPlayersHands(response)
        })

        setCardsDistributed(false)
    }

    return(
        <div className = "game">
            <div className = "info">
                <form autoComplete = "off">
                    <label>
                        Número de partida:
                        <Input
                            name = "gameNumberInput"
                            value = {gameNumberInput}
                            onChange = {(event) => setGameNumberInput(event.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Número de la partida actual: {gameNumberOutput}
                    </label>
                    <br /><br />
                    <label>
                        Le toca al jugador {turn}
                    </label>
                </form>
                <Scoreboard
                    gameNumberOutput = {gameNumberOutput}
                />
            </div>
            {/* Mano del otro jugador 
            show indica si se muestra el frente o el dorso de las cartas*/}
            <Hand 
                hand = {otherPlayersHand}
                show = {false}
            />
            <div className = "middle-decks">
                {/* Mazo para robar cartas */}
                <Hand
                    hand = {[drawCardPile[drawCardPile.length - 1]]}
                    show = {false}
                    onCardClicked = {handleCardDrew}
                />
                {/* Mazo de cartas jugadas */}
                <Hand
                    hand = {[playedCardsPile[playedCardsPile.length - 1]]}
                    show = {true}
                />
                {/* Botón para pasar de turno manualmente si se está en una partida */}
                {gameNumberOutput &&
                    <Button 
                        value = "Pasar turno"
                        onClick = {changeTurn}
                    />
                }
            </div>
            {/* Mano del jugador actual */}
            <Hand 
                hand = {currentPlayersHand}
                onCardClicked = {handleCardPlayed}
                show = {true}
            />
            <div className="btns-container">
                <Button 
                    value = "Nueva partida"
                    onClick = {handleNewGameClick}
                />
                <Button 
                    value = "Unirse a partida"
                    onClick = {handleJoinGameClick}
                />
                <Button 
                    value = "Jugar nuevamente"
                    onClick = {handleRestartClick}
                />
                <Link 
                    to="/login" 
                    className="link"
                    onClick = {() => localStorage.clear()}
                >
                    Reiniciar
                </Link>
            </div>
        </div>
    )
}