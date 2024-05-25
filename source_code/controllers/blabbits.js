const Blabbit = require('../models/blabbit');
const { cloudinary } = require('../cloudinary');
const { encryptMessage, decryptMessage } = require('../utils/encryption');

module.exports.index = async (req, res) => {
    const foundBlabbits = await Blabbit.find({});
    const blabbits = [];

    for(let i = 0; i < foundBlabbits.length; i++){
        let blabbit = foundBlabbits[i];
        let blabbitInfo = await Blabbit.findById(blabbit._id).populate({
            path: 'reviews',
            populate:{
                path: 'author'
            }
        }).populate('author');

        blabbits.push(blabbitInfo);
    }

    res.render('blabbits/index', { blabbits });
};

module.exports.renderNewForm = (req, res) => { 
    res.render('blabbits/new');
}

module.exports.showBlabbit = async (req, res) => {
    const { id } = req.params;
    const blabbit = await Blabbit.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');

    if(!blabbit){
        req.flash('error', 'Can\'t find that blabbit');
        return res.redirect('/blabbits');
    }
    
    res.render('blabbits/show', { blabbit });
};

module.exports.renderEditBlabbit = async (req, res) => {
    const { id } = req.params;
    const foundBlabbit = await Blabbit.findById(id)
    const encrypted = foundBlabbit.message;
    const key = foundBlabbit.key;
    const iv = foundBlabbit.iv;
    const authTag = foundBlabbit.authTag;

    foundBlabbit.message = decryptMessage(encrypted, key, iv, authTag);

    if(!foundBlabbit){
        req.flash('error', 'Can\'t find that blabbit!');
        return res.redirect('/blabbits');
    }

    if(!foundBlabbit.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        res.redirect(`/blabbits/${id}`);
    }

    res.render('blabbits/edit', { blabbit: foundBlabbit });
};

module.exports.createBlabbit = async (req, res, next) => {
    const submittedAt = Math.floor(Date.now()/1000).toString();
    const blabbit = req.body.blabbit;
    const username = req.user.username;
    const { message } = blabbit;

    const [encrypted, key, iv, authTag] = encryptMessage(username, submittedAt, message);

    blabbit.author = req.user._id;
    blabbit.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    blabbit.message = encrypted;
    blabbit.submittedAt = submittedAt
    blabbit.key = key;
    blabbit.iv = iv;
    blabbit.authTag = authTag

    const newBlabbit = new Blabbit(blabbit)

    await newBlabbit.save();

    req.flash('success', 'blabbit successfully created');

    res.redirect(`/blabbits/${newBlabbit._id}`);
};

module.exports.editBlabbit = async (req, res) => {
    const submittedAt = Math.floor(Date.now()/1000).toString();
    const { id } = req.params;
    const blabbit = req.body.blabbit;
    const { message } = blabbit
    const username = req.user.username;
    
    const [encrypted, key, iv, authTag] = encryptMessage(username, submittedAt, message);
    
    blabbit.submittedAt = submittedAt
    blabbit.message = encrypted;
    blabbit.submittedAt = submittedAt
    blabbit.key = key;
    blabbit.iv = iv;
    blabbit.authTag = authTag
    blabbit.image = {url: req.files[0].path, filename: req.files[0].filename}

    const updatedBlabbit = await Blabbit.findByIdAndUpdate(id, { ...blabbit }, {new: true, runValidators: true})

    await updatedBlabbit.save();

    req.flash('success', 'bampground successfully updated')

    res.redirect(`/blabbits/${updatedBlabbit._id}`);
};

module.exports.deleteBlabbit = async (req, res) => {
    const { id } = req.params;

    await Blabbit.findByIdAndDelete(id)

    req.flash('success', 'blabbit successfully deleted')

    res.redirect('/blabbits');
};