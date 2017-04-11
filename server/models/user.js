var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema   = mongoose.Schema,
    userSchema = new Schema({
    	username: {type: String},
 },{timestamps:true});
 	  mongoose.model('User', userSchema)
