import app from "./src/app.js";
import config from "./src/config/env.config.js";
import connectDB from "./src/db/db.js";

app.listen(config.PORT, () => {
  connectDB();
  console.log(`server running at port:${config.PORT}`);
});
