import Card from "./Card.tsx";

export default function Hand(props) {
    const renderCard = (item: string, i: number) => {
        if (item) {
            if (props.show) {
                return(
                    <Card 
                        key = {i}
                        image = {require(`./assets/${item}.png`)}
                        onClick = {() => props.onCardPlayed(i)}
                    />
                )
            } else {
                return(
                    <Card 
                        key = {i}
                        image = {require(`./assets/card-back.png`)}
                    />
                )
            }
        } 
    } 

    return (
        <div className = "hand">
            {props.hand.map((item: string, i: number) => (
                renderCard(item, i)
            ))}
        </div>
    );
}