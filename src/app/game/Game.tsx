import { useState } from "react";
import Card from "./Card.tsx";
import Hand from "./Hand.tsx";

export default function Game() {
    const [currentPlayersHand, setCurrentPlayersHand] = useState(Array(7).fill(null))
    const [otherPlayersHand, setOtherPlayersHand] = useState(Array(7).fill(null))

    const handleCardPlayed = (i) => {
        alert(`Hiciste click en la carta número ${i+1}`)
    }

    const handleCardDrew = () => {
        // Cartas para probar
        setCurrentPlayersHand(['0R','1B','2Y','3G','W','_R','D2B'])
        setOtherPlayersHand(['0R','1B','2Y','3G','W','_R','D2B'])
    }

    return(
        <div className = "game">
            {/* Mano del otro jugador */}
            <Hand 
                hand = {otherPlayersHand}
                show = {false}
            />
            <div className = "middle-cards">
                {/* Mazo para robar cartas */}
                <Card
                    image = {require(`./assets/card-back.png`)}
                    onClick = {handleCardDrew}
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