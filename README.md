# fitio-app-api

API for 'fitio' a voice activated workout application.
<br/><br/>

## Get started

Clone the repo and then run `cd fiti-app-api/functions` The functions directory is where all the source code sits, you should run all npm commands in this directory.<br/><br/>
Once inside the functions directory run `npm install` to install all the dependencies.<br/>
<br/>

### Dependencies

| Package                 | Version | Why?                                                                                                                               |
| ----------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| busboy                  | ^0.3.1  | Use busboy to upload media to firebase storage bucket.                                                                             |
| express                 | ^4.17.1 | Use express to have multiple endpoints off the main /api route.                                                                    |
| firebase                | ^7.6.1  | Main firebase package, need this for all the firebase methods used in application.                                                 |
| firebase-admin          | ^8.6.0  | Firebase admin allows you to sync up and write to firebase project.                                                                |
| firebase-functions      | ^3.3.0  | Package for accessing functions methods. Particular use case here is using the config method to set and interperate env variables. |
| eslint                  | ^5.12.0 | DevDependecy for linting.                                                                                                          |
| eslint-plugin-promise   | ^4.0.1  | DevDependecy for promise linting.                                                                                                  |
| firebase-functions-test | ^0.1.6  | DevDependecy for testing functions.                                                                                                |

<br/>

### Scripts

When using these scripts they need to be appended with `npm run` and run in the `functions` directory.

| Scripts        | Contents                                                                          |
| -------------- | --------------------------------------------------------------------------------- |
| lint           | eslint .                                                                          |
| serve          | firebase serve --only functions                                                   |
| start          | npm run serve                                                                     |
| env            | firebase functions:config:get                                                     |
| dev            | firebase functions:config:set app.environment=\"dev\" && firebase use development |
| prod           | firebase functions:config:set app.environment=\"prod\" && firebase use production |
| predeploy      | npm run dev                                                                       |
| deploy         | firebase deploy --only functions                                                  |
| postdeploy     | npm run env                                                                       |
| preproduction  | npm run prod                                                                      |
| production     | firebase deploy --only functions                                                  |
| postproduction | npm run dev && npm run env                                                        |
| logs           | firebase functions:log                                                            |

<br/>

### Environments

As you can see from the scripts this project uses two environments production and development.
The `prod` and `dev` commands allow you to switch between environments.
By default you will be using the development and should only use production for deploying to the production firebase project.
The code is set to switch config between the two projects, you'll need the credentials and config which are not stored in this repo.
Please get in contact with me if you wish to contribute and I will provide you with the credential files.

<br/><br/>

## Endpoints

All endpoints will need to have the base url appended to the begining.<br/>
Production: `https://europe-west1-fitio-app-prod.cloudfunctions.net/api/`<br/>
Development: `https://europe-west1-fitio-app-dev.cloudfunctions.net/api/`<br/>
<br/>
If you want to run the apis locally use the bellow base urls.<br/>
Production `http://localhost:5000/fitio-app-prod/europe-west1/api/`<br/>
Development: `http://localhost:5000/fitio-app-dev/europe-west1/api/`<br/>

| Endpoint                            | Request | Response                                              | Headers                       | Body                                                                                                                                                                                      | Auth |
| ----------------------------------- | ------- | ----------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| BASE_URL/workouts                   | GET     | Array of all docs in workouts collection              | None                          | None                                                                                                                                                                                      | None |
| BASE_URL/workout                    | POST    | Created workout                                       | Authorization: Bearer `token` | `{ "title": "workout title", "countdown": 0, "excercises": [ { "title": "excercise title", "sets": 0, "reps": 5, "rest": 10, "increment": 0, "double": false, "repetitions": false } ] }` | Yes  |
| BASE_URL/workout/:workoutid         | GET     | Workout with all likes and comments (requires index). | None                          | None                                                                                                                                                                                      | None |
| BASE_URL/workout/:workoutid         | DELETE  | "message": "Workout succesfully deleted"              | Authorization: Bearer `token` | None                                                                                                                                                                                      | Yes  |
| BASE_URL/workout/:workoutid/like    | GET     | Workout with like count incremented.                  | Authorization: Bearer `token` | None                                                                                                                                                                                      | Yes  |
| BASE_URL/workout/:workoutid/unlike  | GET     | Workout with like count decremented.                  | Authorization: Bearer `token` | None                                                                                                                                                                                      | Yes  |
| BASE_URL/workout/:workoutid/comment | POST    | Full comment object                                   | Authorization: Bearer `token` | `{ "body": "comment goes here" }`                                                                                                                                                         | Yes  |
| BASE_URL/signup                     | POST    | userToken: `token`                                    | None                          | `{ "username": "username", "email": "email@email.com", "password": "password", "confirmPassword": "password" }`                                                                           | None |
| BASE_URL/login                      | POST    | userToken: `token`                                    | None                          | `{ "email": "email@email.com", "password": "password" }`                                                                                                                                  | None |
| BASE_URL/user/image                 | POST    | "message": "image uploaded successfully"              | Authorization: Bearer `token` | form-data: /path-to/file.png                                                                                                                                                              | None |
| BASE_URL/user                       | POST    | "message": "Details added successfully"               | Authorization: Bearer `token` | `{ "bio": "", "website": "", "location": "" }`                                                                                                                                            | Yes  |
| BASE_URL/user                       | GET     | Signed in user details (index required)               | Authorization: Bearer `token` | None                                                                                                                                                                                      | Yes  |
| BASE_URL/users/:username            | GET     | Get any users profile                                 | None                          | None                                                                                                                                                                                      | None |
| BASE_URL/notifications              | POST    | Mark notifcations read                                | Authorization: Bearer `token` | `[ notificationId, notificationId, notificationId ]`                                                                                                                                      | Yes  |
