const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/learnagram");

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  email: String,
  department: String,
  year: Number,
  bio: String,
  followers: [{ type: String }],
  following: [{ type: String }],
  posts: [{ type: String }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const users = [

{
user_id:"22CSE001",
username:"Sobika",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:3,
bio:"CSE student exploring full stack development",
followers:["22CSE002","22CSE003","MTR101"],
following:["22CSE004","22CSE005"],
posts:[]
},

{
user_id:"22CSE002",
username:"Arun",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:3,
bio:"Learning backend and databases",
followers:["22CSE001","22CSE003"],
following:["22CSE004","MTR101"],
posts:[]
},

{
user_id:"22CSE003",
username:"Divya",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:3,
bio:"Interested in AI and ML",
followers:["22CSE001","22CSE002"],
following:["22CSE006"],
posts:[]
},

{
user_id:"22CSE004",
username:"Karthik",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:3,
bio:"Frontend developer and UI enthusiast",
followers:["22CSE001","22CSE002"],
following:["22CSE003","22CSE007"],
posts:[]
},

{
user_id:"22CSE005",
username:"Meena",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:3,
bio:"Learning data structures",
followers:["22CSE001"],
following:["22CSE002","22CSE006"],
posts:[]
},

{
user_id:"22CSE006",
username:"Rahul",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:2,
bio:"Cybersecurity enthusiast",
followers:["22CSE003","22CSE005"],
following:["22CSE007","MTR102"],
posts:[]
},

{
user_id:"22CSE007",
username:"Sneha",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:2,
bio:"Machine learning beginner",
followers:["22CSE006"],
following:["22CSE004"],
posts:["POST107"]
},

{
user_id:"22CSE008",
username:"Vignesh",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:2,
bio:"Full stack developer in progress",
followers:["22CSE009"],
following:["22CSE001","22CSE003"],
posts:["POST108"]
},

{
user_id:"22CSE009",
username:"Priya",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:1,
bio:"Interested in cloud computing",
followers:["22CSE008","22CSE010"],
following:["MTR103"],
posts:["POST109"]
},

{
user_id:"22CSE010",
username:"Harish",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
year:1,
bio:"Learning NodeJS and APIs",
followers:["22CSE009"],
following:["22CSE002","22CSE003"],
posts:["POST110"]
},

{
user_id:"MTR101",
username:"DrRaman",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
bio:"Professor of Computer Science",
followers:["22CSE001","22CSE002","22CSE005"],
following:["MTR102"],
posts:[]
},

{
user_id:"MTR102",
username:"DrAnitha",
password:"$2b$10$KbQi9sC9ZQ9qvOB0fOkH0u7i0rGUNShUMHbOWcZH/5Li.yYI8a9ka",
department:"CSE",
bio:"AI and Data Science mentor",
followers:["22CSE006"],
following:["MTR101"],
posts:[]
}

];

async function seedUsers(){
await User.deleteMany();
await User.insertMany(users);
console.log("Users inserted successfully");
mongoose.connection.close();
}

seedUsers();