import { useState } from "react";
import Card from "./Card.tsx";
import Hand from "./Hand.tsx";

export default function Game() {
    const [otherPlayersHand, setOtherPlayersHand] = useState(Array(7).fill(null))
    const [lastCardPlayed, setLastCardPlayed] = useState("")
    const [currentPlayersHand, setCurrentPlayersHand] = useState(Array(7).fill(null))

    const handleCardPlayed = (i) => {
        
    }

    const handleCardDrew = () => {
        // Cartas para probar
        setCurrentPlayersHand(['0R','1B','2Y','3G','W','_R','D2B'])
        setOtherPlayersHand(['0R','1B','2Y','3G','W','_R','D2B'])
        setLastCardPlayed('skipY')
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
                <Card
                    image = {require(`./assets/card-back.png`)}
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
        </div>
    )
}