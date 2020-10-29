const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const path = require('path');
const userRouter = require('./routers/user');

const app = express()
const port = process.env.PORT || 80;

app.use(cors());
app.use('/static', express.static(path.join(__dirname, './public')))
app.use(express.json());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(userRouter);

app.listen(port, () => {
    console.log("Server is up on port", port);
})
