import Card from "./Card.tsx";

export default function Hand(props) {
    // Renderiza cada carta
    const renderCard = (i) => {
        return (
            <Card 
                value = {props.currentPlayersHand[i]}
                onClick = {() => props.onCardPlayed(i)}
            />
        );
    } 
    
    return (
        <div className = "hand">
            {renderCard(0)}
            {renderCard(1)}
            {renderCard(2)}
            {renderCard(3)}
            {renderCard(4)}
            {renderCard(5)}
            {renderCard(6)}
        </div>
    );
}