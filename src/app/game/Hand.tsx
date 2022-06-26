import Card from "./Card.tsx";

export default function Hand(props) {
    const renderCard = (i) => {
        if (props.hand[i]) {
            return (
                <Card 
                    image = {require(`./assets/${props.hand[i]}.png`)}
                    onClick = {() => props.onCardPlayed(i)}
                />
            );
        } else {
            return (
                <div className="empty card"></div>
            );
        }
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