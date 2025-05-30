const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt'); // Use bcrypt, not bcrypt-nodejs

// No need for mongoose.Promise = global.Promise;





const UserSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    password: String, // this should be hashed in real-world scenario
  });
  
  

UserSchema.pre('save', async function(next) {  // Use async/await for cleaner code
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const hash = await bcrypt.hash(user.password, 10); // 10 is the salt rounds (adjust as needed)
        user.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.comparePassword = async function(password) { // Use async/await
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        return false; // Or handle the error as you see fit
    }
};

module.exports = mongoose.model('User', UserSchema);