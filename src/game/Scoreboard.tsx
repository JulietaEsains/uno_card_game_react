import { useEffect, useState } from "react";
import { getCurrentGame, getPlayer, incrementWinsCounter, decreaseWinsCounter } from "./gameServices.ts";
import Button from "../common_components/Button.tsx";

export default function Scoreboard(props) {
    // Nombres de usuario de los jugadores
    const [player1Username, setPlayer1Username] = useState("Jugador en espera");
    const [player2Username, setPlayer2Username] = useState("Jugador en espera");

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

                if (response.player_1_id) {
                    getPlayer(response.player_1_id).then(function (response) {
                        setPlayer1Username(response.username);
                    });
                } 
        
                if (response.player_2_id) {
                    getPlayer(response.player_2_id).then(function (response) {
                        setPlayer2Username(response.username);
                    });
                }

                setPlayer1Wins(response.player_1_wins)
                setPlayer2Wins(response.player_2_wins)
            });

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
                });
            }, 1000);
        }
    }, [props.gameNumberOutput, player1Wins, player2Wins]);

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
                {player1Username}: {player1WinsString}
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
                {player2Username}: {player2WinsString}
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