import { User } from "./user";
import { Meeting } from "./meeting"

export interface Schedule {
    user: User,
    meetings: Meeting[]
}