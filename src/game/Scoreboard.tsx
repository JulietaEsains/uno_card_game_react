import { useEffect, useState } from "react";
import { getCurrentGame, getPlayer, incrementWinsCounter, decreaseWinsCounter } from "./gameServices.ts";
import Button from "../common_components/Button.tsx";

export default function Scoreboard(props) {
    // Datos de los jugadores
    const [player1Id, setPlayer1Id] = useState(0)
    const [player2Id, setPlayer2Id] = useState(0)
    const [player1Username, setPlayer1Username] = useState("En espera");
    const [player2Username, setPlayer2Username] = useState("En espera");

    // Cantidad de victorias de cada jugador
    const [player1Wins, setPlayer1Wins] = useState(0)
    const [player2Wins, setPlayer2Wins] = useState(0)

    // Cantidad de victorias de cada jugador representadas con circulitos
    const [player1WinsString, setPlayer1WinsString] = useState("")
    const [player2WinsString, setPlayer2WinsString] = useState("")

    // Si se está dentro de una partida, se busca mostrar los nombres de usuario de los jugadores en el tablero de puntuación, y representar su cantidad de victorias
    useEffect(() => {
        let player1Score: string = ""
        let player2Score: string = ""

        if (props.gameNumberOutput) {
            getCurrentGame(props.gameNumberOutput).then(function (response) {
                console.log(response)
                setPlayer1Id(response.player_1_id)
                setPlayer2Id(response.player_2_id)
                setPlayer1Wins(response.player_1_wins)
                setPlayer2Wins(response.player_2_wins)
            });

            if (player1Id) {
                getPlayer(player1Id).then(function (response) {
                    setPlayer1Username(response.username);
                });
            } 
        
            if (player2Id) {
                getPlayer(player2Id).then(function (response) {
                    setPlayer2Username(response.username);
                });
            }

            for (let i = 0; i < player1Wins; i++) {
                player1Score += " o "
            }
            setPlayer1WinsString(player1Score)
            
            for (let i = 0; i < player2Wins; i++) {
                player2Score += " o "
            }
            setPlayer2WinsString(player2Score)

            // Chequea cada segundo si cambió el scoreboard en algún browser
            let interval = setInterval(() => {
                getCurrentGame(props.gameNumberOutput).then(function (response) {
                    setPlayer1Wins(response.player_1_wins)
                    setPlayer2Wins(response.player_2_wins)
                    setPlayer1Id(response.player_1_id)
                    setPlayer2Id(response.player_2_id)
                });
            }, 1000);
        }
    }, [props.gameNumberOutput, player1Wins, player2Wins, player1Id, player2Id]);

    const handleWinAddition = (playerId: string) => {
        if (props.gameNumberOutput) {
            incrementWinsCounter(props.gameNumberOutput, playerId).then(function (response) {
                console.log(response)
                setPlayer1Wins(response.player_1_wins)
                setPlayer2Wins(response.player_2_wins)
            })
        }
    }

    const handleWinRemoval = (playerId: string) => {
        if (props.gameNumberOutput) {
            decreaseWinsCounter(props.gameNumberOutput, playerId).then(function (response) {
                console.log(response)
                setPlayer1Wins(response.player_1_wins)
                setPlayer2Wins(response.player_2_wins)
            })
        }
    }

    return(
        <div className="scoreboard">
            <label>
                {player1Username} (jugador 1): {player1WinsString}
                <Button
                    value = "+"
                    onClick = {() => handleWinAddition("1")}
                />
                <Button
                    value = "-"
                    onClick = {() => handleWinRemoval("1")}
                />
            </label>
            <br /><br />
            <label>
                {player2Username} (jugador 2): {player2WinsString}
                <Button
                    value = "+"
                    onClick = {() => handleWinAddition("2")}
                />
                <Button
                    value = "-"
                    onClick = {() => handleWinRemoval("2")}
                />
            </label>
        </div>
    )
}