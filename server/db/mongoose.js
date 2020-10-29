const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mern-userauth',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false // false is set tp remove  DeprecationWarning: collection.findAndModify is deprecated
})
