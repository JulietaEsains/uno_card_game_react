import { useState } from "react";
import { newGame, distributeCards } from "./gameServices.ts";
import Button from "../common_components/Button.tsx"
import Hand from "./Hand.tsx";

export default function Game() {
    const [gameId, setGameId] = useState("")
    const [otherPlayersHand, setOtherPlayersHand] = useState(Array(10).fill(null))
    const [drawCardPile, setDrawCardPile] = useState(Array(108).fill(null))
    const [playedCardsPile, setPlayedCardsPile] = useState(Array(108).fill(null))
    const [currentPlayersHand, setCurrentPlayersHand] = useState(Array(10).fill(null))
    const [turn, setTurn] = useState("1")
    const [cardsDistributed, setCardsDistributed] = useState(false)

    const handleNewGameClick = () => {

        newGame().then(function (response) {
            console.log(response)
            setGameId(response.id)
            setOtherPlayersHand(response.player_2_hand)
            setDrawCardPile(response.draw_card_pile)
            setPlayedCardsPile(response.played_cards_pile)
            setCurrentPlayersHand(response.player_1_hand)
            setTurn(response.turn)
        })

    }

    const handleCardPlayed = (i) => {
        
    }

    const handleCardDrew = () => {
        if (cardsDistributed) {
            alert("Carta robada")
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
                {/*<Button 
                    value = "Unirse a partida"
                    onClick = {handleJoinGameClick}
                />
                <Link 
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