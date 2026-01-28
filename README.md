## Getting it running
- `npm i`
- `npm run dev`

<br>

## To utilize `api.http`
- download `rest client` in VS Code


<br>

## API Routes

### USERS

| Method | Endpoint         | Description                   | Body Required          | Auth      |
| ------ | ---------------- | ----------------------------- | ---------------------- | --------- |
| GET    | `/api/users`     | Get all users                 | ❌                      | ❌         |
| POST   | `/api/users`     | Create a new user             | ✅ (`name`, `username`) | ❌         |
| GET    | `/api/users/:id` | Get a user by ID              | ❌                      | ❌         |
| PUT    | `/api/users/:id` | Update a user’s username      | ✅ (`username`)         | ❌         |
| DELETE | `/api/users/:id?api-key=perscholas` | Delete a user and their posts | ❌                      | ✅ API Key |


### POSTS

| Method | Endpoint             | Description                      | Body Required            | Auth      |
| ------ | -------------------- | -------------------------------- | ------------------------ | --------- |
| GET    | `/api/posts/:id`     | Get a post by ID                 | ❌                        | ❌         |
| POST   | `/api/posts/:userId` | Create a post for a user         | ✅ (`title`, `content`)   | ❌         |
| PUT    | `/api/posts/:id`     | Update a post’s title or content | ✅ (`title` or `content`) | ❌         |
| DELETE | `/api/posts/:id?api-key=perscholas`     | Delete a post                    | ❌                        | ✅ API Key |


### LIKES

| Method | Endpoint                   | Description   | Body Required | Auth      |
| ------ | -------------------------- | ------------- | ------------- | --------- |
| POST   | `/api/likes/:postId/likes` | Like a post   | ✅ (`userId`)  | ❌         |
| DELETE | `/api/likes/:postId/likes?api-key=perscholas&userId=USERID` | Unlike a post | ❌             | ✅ API Key |

<br>

### API-KEYS TS Setup
- To add something to the req.body object, you would have to create a `express.d.ts` file and add the following content inside. since we need a "key" key this is how we apply the key to the body object without getting a type error.
- Can add other key value pairs if nessecary 
```
import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    key?: string;
    userId?: number;
  }
}

```