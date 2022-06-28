import { useState } from "react";
import { newGame, joinGame, distributeCards, drawCard, playCard } from "./gameServices.ts";
import Input from "../common_components/Input.tsx"
import Button from "../common_components/Button.tsx"
import Hand from "./Hand.tsx";
import Scoreboard from "./Scoreboard.tsx";

export default function Game() {
    const [gameId, setGameId] = useState("")
    const [gameNumberInput, setGameNumberInput] = useState("")
    const [gameNumberOutput, setGameNumberOutput] = useState("")

    const [otherPlayersHand, setOtherPlayersHand] = useState(Array(108).fill(null))
    const [drawCardPile, setDrawCardPile] = useState(Array(108).fill(null))
    const [playedCardsPile, setPlayedCardsPile] = useState(Array(108).fill(null))
    const [currentPlayersHand, setCurrentPlayersHand] = useState(Array(108).fill(null))

    const [turn, setTurn] = useState("1")
    const [cardsDistributed, setCardsDistributed] = useState(false)

    const handleNewGameClick = () => {

        newGame().then(function (response) {
            console.log(response)
            setGameId(response.id)
            setGameNumberOutput(response.id)
            setOtherPlayersHand(response.player_2_hand)
            setDrawCardPile(response.draw_card_pile)
            setPlayedCardsPile(response.played_cards_pile)
            setCurrentPlayersHand(response.player_1_hand)
            setTurn(response.turn)
        })
    }

    const handleJoinGameClick = () => { 

        if (!gameNumberInput) {
            alert("Por favor ingresa un número de partida para poder unirte a una.");
            return;
        }

        setGameId(gameNumberInput);

        // Actualización de la partida existente
        try {
            joinGame(gameId).then(function (response) {
                console.log(response);
                setGameId(response.id)
                setGameNumberOutput(response.id)
                setOtherPlayersHand(response.player_1_hand)
                setDrawCardPile(response.draw_card_pile)
                setPlayedCardsPile(response.played_cards_pile)
                setCurrentPlayersHand(response.player_2_hand)
                setTurn(response.turn)
            });
        } catch (err) {
            alert("No existe partida con ese número.")
            throw err;
        } 
    }

    const handleCardPlayed = (i) => {
        playCard(gameId, i).then(function (response) {
            console.log(response)
            setPlayedCardsPile(response.played_cards_pile)
            setCurrentPlayersHand(response.player_1_hand)
        })
    }

    const handleCardDrew = () => {
        if (cardsDistributed) {
            
            drawCard(gameId).then(function (response) {
                console.log(response)
                setDrawCardPile(response.draw_card_pile)
                setCurrentPlayersHand(response.player_1_hand)
            })

        } else {

            distributeCards(gameId).then(function (response) {
                console.log(response)
                setOtherPlayersHand(response.player_2_hand)
                setDrawCardPile(response.draw_card_pile)
                setPlayedCardsPile(response.played_cards_pile)
                setCurrentPlayersHand(response.player_1_hand)
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