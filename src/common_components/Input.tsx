export default function Input(props) {
    return (
        <input
            name = {props.name} 
            type = {props.type}
            defaultValue = {props.value}
            onChange = {props.onChange}
        />
    );
}