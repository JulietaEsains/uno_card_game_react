import axios from "axios";
import { environment } from "../app/environment/environment.ts"

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
axios.defaults.headers.common["Content-Type"] = "application/json"

export interface Game {
    id: string
    player_1_id: string
    player_2_id: string
    player_1_wins: string
    player_2_wins: string
    player_1_hand: string[]
    player_2_hand: string[]
    draw_card_pile: string[]
    played_cards_pile: string[]
    turn: string
}

// Nueva partida donde el jugador 1 es el usuario autenticado que realiza la request
export async function newGame(): Promise<Game> {
    return (await axios.post(`${environment.backendUrl}/games`, {})).data.game as Game;
}