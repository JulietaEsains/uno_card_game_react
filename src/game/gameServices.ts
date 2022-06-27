import axios from "axios";
import { environment } from "../app/environment/environment.ts"
import { User } from "../user/userServices.ts"

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

// Consultar la partida con un determinado id
export async function getCurrentGame(gameId: string): Promise<Game> {
    return (await axios.get(`${environment.backendUrl}/games/${gameId}`, {})).data.game as Game;
}

// Consultar el jugador con un determinado id
export async function getPlayer(userId: string): Promise<User> {
    return (await axios.get(`${environment.backendUrl}/users/${userId}`, {})).data.user as User;
}

// Nueva partida donde el jugador 1 es el usuario autenticado que realiza la request
export async function newGame(): Promise<Game> {
    return (await axios.post(`${environment.backendUrl}/games`, {})).data.game as Game
}

// Repartición inicial de cartas
export async function distributeCards(gameId: string): Promise<Game> {
    return (await axios.patch(`${environment.backendUrl}/games/${gameId}`, {
        game: {
            update_type: "distribute"
        }
    })).data.game as Game
}

// Robar una carta
export async function drawCard(gameId: string): Promise<Game> {
    return (await axios.patch(`${environment.backendUrl}/games/${gameId}`, {
        game: {
            update_type: "draw"
        }
    })).data.game as Game
}