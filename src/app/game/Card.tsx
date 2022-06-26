export default function Card(props) {
    return (
        <img
            src = {props.image}
            alt = ""
            className = "card"
            onClick = {props.onClick}
        />
    );
}