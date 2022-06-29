import { useState } from "react";
import { newGame, joinGame, getCurrentGame, distributeCards, drawCard, playCard } from "./gameServices.ts";
import Input from "../common_components/Input.tsx"
import Button from "../common_components/Button.tsx"
import Hand from "./Hand.tsx";
import Scoreboard from "./Scoreboard.tsx";

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

    const handleNewGameClick = () => {

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
        playCard(gameNumberOutput, i).then(function (response) {
            console.log(response)
            setPlayedCardsPile(response.played_cards_pile)

            setPlayersHands(response)
        })
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
                {/*<Link 
                    to="/login" 
                    className="link"
                    onClick = {() => localStorage.clear()}
                >
                    Reiniciar
                </Link>*/}
            </div>
        </div>
    )
}