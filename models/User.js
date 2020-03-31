import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  avatarUrl: String,
  facebookId: {
    type: String,
    unique: true,
  },
  githubId: {
    type: String,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  usernameLowerCase: true,
  usernameQueryFields: [ 'userName' ],
});

const model = mongoose.model('User', UserSchema);

export default model;
