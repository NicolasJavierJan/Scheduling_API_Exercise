import { User } from "./user";

export interface Meeting {
    users: User[],
    hour: number,
    day: number,
    month: number,
    year: number
}