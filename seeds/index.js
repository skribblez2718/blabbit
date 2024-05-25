const mongoose = require('mongoose');
const { usernames } = require('./usernames');
const { messages } = require('./messages');
const { titles } = require('./titles');
const { imageURLs } = require('./imageURLs');
const Blabbit = require('../models/blabbit');
const User = require('../models/user');
const { encryptMessage } = require('../utils/encryption');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const generateRandom = (max) => {
    return Math.floor(Math.random() * max) + 1;
}

const seedDB = async () => {
    try {
        await Blabbit.deleteMany({});
        await User.deleteMany({});

        const blabbitCount = 7;

        for(let i = 0; i < blabbitCount; i++){
            let username = usernames[i];
            const user = await User.findOne({username: usernames[i]});
            const userID = user._id.toString()
            let message = messages[i];
            let randomTime = generateRandom(604800);
            let submittedAt = Math.floor(Date.now()/1000 - randomTime).toString();
            let [encrypted, key, iv, authTag] = encryptMessage(username, submittedAt, message);

            let blabbit = new Blabbit({
                title: titles[i],
                message: encrypted,
                author: userID,
                key: key,
                iv: iv,
                authTag: authTag,
                submittedAt: submittedAt,
                image: {
                    url: imageURLs[i],
                    filename: `blabbit/${imageURLs[i].split('blabbit')[1]}`
                },
            })

            await blabbit.save(); 
        }

        const blabbits = await Blabbit.find({});

        const blabbitIDs = blabbits.map((blabbit) => {
            return blabbit._id.toString()
        })

        console.log(blabbitIDs);
        
    } catch {
        console.error();
    }
}

seedDB().then(() => {
    db.close();
    console.log('Connection closed')
});