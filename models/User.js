import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import bcrypt from 'bcrypt';

mongoose.Promise = Promise;

const { Schema } = mongoose;
mongoose.Types.ObjectId.isValid();

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

UserSchema.plugin(beautifyUnique);

UserSchema.methods.encryptPassword = function (password) {
  console.log(' encryptPassword password',bcrypt.hashSync(password, 2))
  return bcrypt.hashSync(password, 2);
};

UserSchema.methods.checkPassword = async function (password) {
  console.log('compare', password, this.password)
  const check = await bcrypt.compare(password, this.password)
  return check;
};

// function dataURLtoFile(dataurl, filename) {
//   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
//   while(n--){
//       u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], filename, {type:mime});
// }

// //Usage example:
// var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=', 'hello.txt');
// console.log(file);

const User = mongoose.model('User', UserSchema);

export default User;
