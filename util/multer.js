const multer  = require('multer')
// const upload = multer({ dest: 'public/resume/../coverletter/',  })
const path = require("path")
const storageForResume = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/resume/")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
  })

  const storageForCoverLetter= multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/coverLetter/")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
  })
  
  const uploadStorage = multer({ storage: storageForResume })
const uploadCoverLetter = multer({storage:storageForCoverLetter,fileFilter:function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if(ext !== '.md' && ext !== '.markdown') {
      return callback(new Error('Only md are allowed'))
  }
  callback(null, true)
},})

  module.exports = {uploadStorage,uploadCoverLetter}