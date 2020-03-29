const { db } = require("../utils/admin");
const { WORKOUTS_COLLECTION } = require("../routes/constants");
const { workouts } = require("../seed.json");

console.log(workouts);

workouts.forEach(workout => {
  db.collection(WORKOUTS_COLLECTION)
    .add(workout)
    .then(doc => {
      console.log("Document written with id: ", doc.id);
    })
    .catch(error => {
      console.error(error);
    });
});
