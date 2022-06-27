export default function Card(props) {
    return (
        <img
            key = {props.key}
            src = {props.image}
            alt = ""
            className = "card"
            onClick = {props.onClick}
        />
    );
}