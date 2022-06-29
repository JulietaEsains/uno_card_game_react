import { useState } from "react";
import { newGame, joinGame, getCurrentGame, 
        distributeCards, drawCard, playCard, toggleTurn, playAgain } from "./gameServices.ts";
import Input from "../common_components/Input.tsx"
import Button from "../common_components/Button.tsx"
import Hand from "./Hand.tsx";
import Scoreboard from "./Scoreboard.tsx";
import { Link } from "react-router-dom";

export default function Game() {
    let gameId = ""
    let is1CurrentPlayer = true

    const [gameNumberInput, setGameNumberInput] = useState("")
    const [gameNumberOutput, setGameNumberOutput] = useState("")

    const [otherPlayersHand, setOtherPlayersHand] = useState(Array(108).fill(null))
    const [drawCardPile, setDrawCardPile] = useState(Array(108).fill(null))
    const [playedCardsPile, setPlayedCardsPile] = useState(Array(108).fill(null))
    const [currentPlayersHand, setCurrentPlayersHand] = useState(Array(108).fill(null))

    const [turn, setTurn] = useState("1")
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

        is1CurrentPlayer = true
        checkGameStatus()
    }

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

        // Actualización de la partida existente
        try {
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
        } catch (err) {
            alert("No existe partida con ese número.")
            throw err;
        } 

        is1CurrentPlayer = false
        setCardsDistributed(true)
        checkGameStatus()
    }

    const handleCardPlayed = (i) => {
        // Obtiene el primer caracter de la carta jugada para verificar si es un número        
        let playedCardFirstChar = currentPlayersHand[i].charAt(0)

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
            {/* Mano del otro jugador */}
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