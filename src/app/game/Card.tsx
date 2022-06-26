export default function Card(props) {
    return (
        <button
            className = "card"
            onClick = {props.onClick}
        >
            {props.value}
        </button>
    );
}