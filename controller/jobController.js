const Application = require("../model/applicationSchema");
const Job = require("../model/jobSchema");


module.exports = {
  addJob: async (req, res) => {
    try {
      const { title, description, experienceLevel, skills } = req.body;

      const newJob = await new Job({
        title,
        description,
        experienceLevel,
        skills,
        user: req.user._id,
      }).save();
      res.json({
        sucess: true,
        message: newJob,
      });
    } catch (err) {
      console.log(err);
      res.staus(500).json({ error: "Internal Server Error" });
    }
  },
  updateJob: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedJob = await Job.findOneAndUpdate({_id:id,user:req.user._id}, req.body, {
        new: true,
      });
      
      res.json({ sucess: true, message: updatedJob });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteJob: async (req, res) => {
    try {
      const { id } = req.params;
      await Job.findOneAndDelete({_id:id,user:req.user._id});
      res.json({
        sucess: true,
        message: "deleted sucessfuly",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllJobs: async (req, res) => {
    try {
      let experienceLevel = req.query.experience || "All";
      const expOptions = ["beginner", "intermediate", "senior"];

      experienceLevel === "All"
        ? (experienceLevel = [...expOptions])
        : (experienceLevel = req.query.experience.split(","));

      let skills = req.query.skill?.split(",");
      let jobs;
      let search = req.query.search || "";
      let limit = Number(req.query.limit || 10);
      const page = Number(req.query.page || 1);

      const skipVal = limit * (page - 1);
      const totalDocs = await Job.countDocuments();

      if (skills) {
        let regexSkills = skills.map(function (e) {
          return new RegExp(e, "i");
        });
        jobs = await Job.find({
          title: { $regex: search, $options: "i" },
          skills: { $in: regexSkills },
        })
          .where("experienceLevel")
          .in([...experienceLevel])
          .sort({ createdAt: -1 })
          .skip(skipVal)
          .limit(limit);
        return res.json({
          sucess: true,
          message: {
            jobs,
            pagination: {
              limit,
              page,
              totalDocs,
            },
          },
        });
      }

      jobs = await Job.find({ title: { $regex: search, $options: "i" } })
        .where("experienceLevel")
        .in([...experienceLevel])
        .sort({ createdAt: -1 })
        .skip(skipVal)
        .limit(limit);

      res.json({
        sucess: true,
        message: {
          jobs,
          pagination: {
            limit,
            page,
            totalDocs,
          },
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getSpecificJob: async (req, res) => {
    try {
      console.log(result);
      const { id } = req.params;
      const jobDetials = await Job.findById(id).populate("user", "email");
      if (!jobDetials) return res.status(404).json({ error: "Not Found" });
      res.json({
        sucess: true,
        message: jobDetials,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  applayJob: async (req, res) => {
    try {
      const { id } = req.params;
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ error: "Job is not found" });

      const postedBy = job.user;
      const appliedBy = req.user._id;

      if (!req.file)
        return res.status(404).json({ error: "please add cover letter" });

      const coverLetterPath = __dirname + req.file.path;
      const applayed = await new Application({
        postedBy,
        appliedBy,
        job: id,
      });

      applayed.coverLetter = coverLetterPath;
      await applayed.save();
      res.json({
        sucess: true,
        message: applayed,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  getApplicants: async (req, res) => {
    try {
      const { id } = req.params;
      let limit = Number(req.query.limit || 10);
      const page = Number(req.query.page || 1);
      const skipVal = limit * (page - 1);
      const totalDocs = await Application.find({
        job: id,
        postedBy: req.user._id,
      }).countDocuments();
      const applicans = await Application.find({
        job: id,
        postedBy: req.user._id,
      })
        .skip(skipVal)
        .limit(limit)
        .populate("appliedBy", "name email")
        .populate("job");
      res.json({
        sucess: true,
        message: {
          applicans,
          pagination: {
            limit,
            page,
            totalDocs,
          },
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
