const router = require("express").Router()
let validateJWT = require("../middleware/validate-jwt")

const {WorkoutModel} = require("../models")


router.post("/log", validateJWT, async (req, res) => {
  const {description, definition, result} = req.body.workout;
  const {id} = req.user;
  const workoutEntry = {
    description,
    definition,
    result,
    owner: id
  }
  try {
    const newWorkout = await WorkoutModel.create(workoutEntry)
    res.status(200).json(newWorkout);
  } catch (err) {
    res.status(500).json({error: err});
  }
  WorkoutModel.create(workoutEntry)
});

router.get("/log", async (req, res) => {
  let {id} = req.user;
  try {
    const userWorkouts = await WorkoutModel.findAll({
      where: {
        owner: id
      }
    });
    res.status(200).json(userWorkouts); 
  } catch (err) {
    res.status(500).json({error: err});
  }
}) 

router.get("/log/:id", validateJWT, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id
  try {
    const results = await WorkoutModel.findOne({
      where: {
        id: id,
        owner: userId
      }
    });
    res.status(200).json({
      message: "Workout located",
      results,
    }); 
  } catch (err) {
    res.status(500).json({error: err})
  }
});

router.put("/log/:id", validateJWT, async (req, res) => {
  const {description, definition, result} = req.body.workout;
  const workoutId = req.params.id;
  const userId = req.user.id;

  const query = {
    where: {
      id: workoutId,
      owner: userId
    }
  };

  const updatedWorkout = {
    description: description,
    definition: definition,
    result: result
  };

  try {
    const update = await WorkoutModel.update(updatedWorkout, query);
    res.status(200).json({
      message: "Workout successfully updated!",
      updatedWorkout});
  } catch (err) {
    res.status(500).json({error: err});
  }
});

router.delete("/log/:id", validateJWT, async (req, res) => {
  const ownerId = req.user.id;
  const workoutId = req.params.id;

  try {
    const query = {
      where: {
        id: workoutId,
        owner: ownerId
      }
    };

    await WorkoutModel.destroy(query);
    res.status(200).json({
      message: "Workout log deleted"
    });
  } catch (err) {
    res.status(500).json({error: err});
  }
})






module.exports = router; 