export type GameUpdateRequest = {
    home_team: string,
    away_team: string,
    home_score: number | null,
    away_score: number | null,
    location: string,
    date: string
}