## Packages
- express
- @types/express
- typescript
- ts-node
- dotenv
- supertest
- @types/supertest
- jest
- @types/jest
- @types/dotenv

# Compromises
- Meeting Interface: I went with hour/day/month/year because Time management is always tricky. For a full fledged solution, I would never use this simple approach.
- No PUT method for Meetings. It would be great to have a way of editing the existing meetings, but was not part of the requirements and I saved time with that.
- I would have liked to also make a constraint on hours (from 9 to 17 for example), but again it was not in the requirements.
- Testing. As I was reaching the deadline time and testing Typescript using Jest and Supertest is somewhat new to me, I decided to implement the Unit tests only for the /users endpoint. All the endpoints were tested with Postman as I was creating them, so the solution works.