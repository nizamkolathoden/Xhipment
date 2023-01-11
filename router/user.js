const {
  addJob,
  getAllJobs,
  updateJob,
  getSpecificJob,
  applayJob,
  getApplicants,
  deleteJob,
} = require("../controller/jobController");
const { isloggedIn } = require("../middleware/userMiddleware");
const {uploadStorage,uploadCoverLetter} = require("../util/multer");

const router = require("express").Router();

// router.post("/updateresume",)

router.get("/jobs", getAllJobs);

router.post("/addjob", isloggedIn, addJob);

router.route("/job/:id").get(getSpecificJob).put(isloggedIn, updateJob).delete(isloggedIn,deleteJob);

router.post("/job/applay/:id",uploadCoverLetter.single('coverLetter'), isloggedIn,applayJob);

router.get("/job/applicans/:id", isloggedIn,getApplicants);


module.exports = router;
