const mongoose = require("mongoose");
const env = require("./env");

async function connect(){
  try {
    await mongoose.connect(env.DB_URL);
  } catch(err){
    console.log(err);
  }
}

mongoose.connection
.on("open", () => {
    console.log("> Database connected");
})

module.exports = {connect}