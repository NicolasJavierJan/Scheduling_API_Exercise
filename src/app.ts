import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';

import { User } from "./interfaces/user";
import { Meeting } from "./interfaces/meeting";
import { Schedule } from "./interfaces/schedule";

dotenv.config();

export const app : Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const users : User[] = [];
const meetings : Meeting[] = [];
export const schedules : Schedule[] = [];

app.get("/users", (req : Request, res : Response) => {
    res.status(200).send(users);
})

// Create persons with name and unique email
app.post("/users", (req : Request, res : Response) => {
    
    // Check if email already in use!
    const userToCreate : User = req.body;

    const newSchedule : Schedule = {
        user: userToCreate,
        meetings: []
    }
    
    const userExists = users.find(user => user.email === userToCreate.email);

    if (userExists){
        return res.status(400).send("User already exists");
    }

    users.push(userToCreate);
    schedules.push(newSchedule);
    res.status(200).send(users);
    
})

// Create meetings, involving one or more persons at a given time
// Meetings can just start at the hour mark and be exactly one hour

app.post("/meetings", (req : Request, res : Response) => {

    const meetingToCreate : Meeting = req.body;
    const meetingUsers : User[] = meetingToCreate.users;

    // Check if the Users for the meeting exist or not in the System before:
    const userExists = meetingUsers.every(newUser => {
        return users.some(existingUser => existingUser.email === newUser.email);
    });

    if (!userExists) {
        return res.status(404).send("One or more users do not exist");
    }
    
    const meetingExists = meetings.some(meeting => meeting.hour === meetingToCreate.hour && 
        meeting.day === meetingToCreate.day && meeting.month === meetingToCreate.month && meeting.year === meetingToCreate.year);

    if (meetingExists) {
        return res.status(400).send("Meeting already exists");
    } 

    // Add the meeting to the user's schedules
    meetingUsers.forEach(user => {
        const userSchedule = schedules.find(schedule => schedule.user.email === user.email);
        userSchedule?.meetings.push(meetingToCreate);
    })

    meetings.push(meetingToCreate);
    res.status(200).send(meetings);
        
})

// Show the schedule for a given person
app.post("/schedules", (req : Request, res : Response) => {    
    const userSchedule = schedules.find(schedule => schedule.user.email === req.body.email);

    if (userSchedule){
        res.status(200).send(userSchedule);
    } else {
        res.status(404).send("User not found");
    }
})

// Show available time-slots for one or more persons to book a Meeting:
app.post("/availabilities", (req : Request, res: Response) => {
    const usersInRequest : User[] = req.body.users;
    const userSchedules : Schedule[] = [];
    const dayInRequest = req.body.day;
    const monthInRequest = req.body.month;
    const yearInRequest = req.body.year;

    usersInRequest.forEach(user => {
        const userSchedule = schedules.find(schedule => schedule.user.email === user.email);
        if (userSchedule) {
            userSchedules.push(userSchedule);
        } else {
            return res.status(404).send("One or more users are not found");
        }
    })

    const availableHours : number[] = [];

    for (let hour = 0; hour < 24; hour++){
        const isAvailable = userSchedules.every(schedule => {
            return !schedule.meetings.some(meeting => 
                meeting.day === dayInRequest &&
                meeting.month === monthInRequest &&
                meeting.year === yearInRequest &&
                meeting.hour === hour)
        });
        
        if (isAvailable) {
            availableHours.push(hour);
        }
    }

    res.status(200).send(`Users are available at ${availableHours} hours`);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})