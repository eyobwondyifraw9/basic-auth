const config = require("./config");

config.db.connect();

const app = require("./app");

app.listen(config.env.PORT, "0.0.0.0" ,() => {
    console.log("> Server hosted at \x1b[34mhttp://localhost:%d\x1b[0m", config.env.PORT);
})