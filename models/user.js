var mongoose = require('mongoose');
const { UserError } = require('./../errors/customErrors');

const contribution = new mongoose.Schema({
    xdr1: { type: String, default: null },
    xdr2: { type: String, default: null },
    xdr3: { type: String, default: null },
    ca2: { type: String, default: null },
    xlmAmount: { type: Number, default: 0 },
},
    { timestamps: true }
);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthdate: { type: Date, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    whitelist: { type: Boolean, default: false },
    kyc: { type: Boolean, default: false },
    contributions: [{
        type: contribution,
        default: contribution
    }]
},
    { timestamps: true }
);


var User = mongoose.model('User', userSchema);

/*      problem/
 * We need to have some way of associating a real-world user with our
 * database user.
 *
 *      way/
 * We will use the user's email as a unique identifier. Before saving
 * any user we first validate that there is not already a user with the
 * given email in the database.
 *
 * TODO: MY@GMAIL.COM and my@gmail.com should match the same user
 */
userSchema.pre('save', async function (next) {
    const user = await User.findOne({ email: this.email });
    if (user) {
        next(new UserError(`User already exist with email: ${this.email}`, 400));
    }
    return;
});

module.exports = User;
