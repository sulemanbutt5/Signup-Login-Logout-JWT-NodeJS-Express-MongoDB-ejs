const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Kindly enter the email!'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid Email Address']

    },
    password: {
        type: String,
        required: [true, 'Kindly enter the password!'],
        minlength: [3, 'Password should be atleast 3 characters'],

    },

})

//fire the function after doc saved to db
userSchema.post('save', function (doc, next) {

    console.log('New user created and Saved', doc)
    next()
})

//fire the function before doc saved to db
userSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    console.log('User about to be created and saved: ', this)
    next()
})

//static methods
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    console.log('\nUser:', user)
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        console.log('Password Matched?', auth)
        if (auth) {
            return user
        }
        throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}


const User = mongoose.model('user', userSchema)
module.exports = User;