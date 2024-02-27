import request from "supertest";
import { app, schedules } from "../src/app";


import { User } from "../src/interfaces/user";
import { Schedule } from "../src/interfaces/schedule"

describe('GET /users', () => {
    it("responds with the Users array", async() => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([]));
    })
})

describe('POST /users', () => {
    it("creates a new User and Schedule", async() => {

        const user : User = {
            name: "Nicolas", 
            email: "nicolas@mail.com"
        };

        const response = await request(app).post("/users").send(user);

        expect(response.status).toBe(200);

        expect(response.body).toEqual(expect.arrayContaining([user]));

        const createdUser = response.body.find((createdUser: User) => createdUser.email === user.email);
        const userSchedule = schedules.find((schedule: Schedule) => schedule.user.email === createdUser.email);
        expect(userSchedule).toBeDefined();
        expect(userSchedule?.meetings).toEqual([]);
    });

    it('returns 400 if user email already exists', async () => {
        
        const existingUser: User = {
        name: 'Nicolas',
        email: 'nicolas@mail.com',
        };

        
        const response = await request(app)
        .post('/users')
        .send(existingUser);

        
        expect(response.status).toBe(400);
        expect(response.text).toBe('User already exists');
    });
})