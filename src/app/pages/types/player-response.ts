export type PlayerResponse = {
    id: string,
    name: string,
    position: string,
    team_id: string,
    points?: number,
    assists?: number,
    rebounds?: number,
    clubName?: string,
    teamName?: string
}