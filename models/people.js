const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => console.log(`connected mongoDB`))
  .catch((error) =>
    console.log(`error connecting to mongoDB: ${error.message}`)
  );

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{6,}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
