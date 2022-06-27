import { useState } from "react";
import { newGame } from "./gameServices.ts";
import Button from "../common_components/Button.tsx"
import Hand from "./Hand.tsx";

export default function Game() {
    const [otherPlayersHand, setOtherPlayersHand] = useState(Array(10).fill(null))
    const [drawCardPile, setDrawCardPile] = useState(Array(108).fill(null))
    const [playedCardsPile, setPlayedCardsPile] =useState(Array(108).fill(null))
    const [currentPlayersHand, setCurrentPlayersHand] = useState(Array(10).fill(null))
    const [turn, setTurn] = useState("1")
    const [cardToDraw, setCardToDraw] = useState("")
    const [lastCardPlayed, setLastCardPlayed] = useState("")

    let gameId: string = ""

    const handleNewGameClick = () => {

        newGame().then(function (response) {
            console.log(response)
            gameId = response.id
            setOtherPlayersHand(response.player_2_hand)
            setDrawCardPile(response.draw_card_pile)
            setPlayedCardsPile(response.played_cards_pile)
            setCurrentPlayersHand(response.player_1_hand)
            setTurn(response.turn)
            setCardToDraw(response.draw_card_pile[response.draw_card_pile.length - 1])
            setLastCardPlayed(response.played_cards_pile[response.played_cards_pile.length - 1])
        })

    }

    const handleCardPlayed = (i) => {
        
    }

    const handleCardDrew = () => {
        
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
                    hand = {[cardToDraw]}
                    show = {false}
                    onClick = {handleCardDrew}
                />
                {/* Mazo de cartas jugadas */}
                <Hand
                    hand = {[lastCardPlayed]}
                    show = {true}
                />
            </div>
            {/* Mano del jugador actual */}
            <Hand 
                hand = {currentPlayersHand}
                onCardPlayed = {handleCardPlayed}
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