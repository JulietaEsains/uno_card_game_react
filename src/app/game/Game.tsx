import { useState } from "react";
import Hand from "./Hand.tsx";

export default function Game() {
    const [currentPlayersHand, setCurrentPlayersHand] = useState(Array(7).fill(null))

    const handleCardPlayed = (i) => {
        alert(`Hiciste click en la carta número ${i+1}`)
    }

    return(
        <div className = "game">
            <Hand 
                currentPlayersHand = {currentPlayersHand}
                onCardPlayed = {handleCardPlayed}
            />
        </div>
    )
}