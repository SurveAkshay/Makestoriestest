const multer = require("multer");
	
var storage = multer.diskStorage({ 
	destination: function (req, file, cb) {
		cb(null, "public") 
	}, 
	filename: function (req, file, cb) { 
	    cb(null, file.originalname) 
	} 
}) 
	
const imgMiddleware = multer({ 
	storage: storage, 
	fileFilter: function (req, file, cb){ 
	
		// Set the filetypes, it is optional 
		var filetypes = /jpeg|jpg|png|webp/; 
		var mimetype = filetypes.test(file.mimetype); 

		if (mimetype) { 
			return cb(null, true); 
		} 
	
		cb("Error: File upload only supports the " + "following filetypes - " + filetypes); 
	} 
})

module.exports = imgMiddleware;