const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    `Please provide the password as an argument: node mongo.js <password>`
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => console.log(`connected mongoDB`))
  .catch((error) =>
    console.log(`error connecting to mongoDB: ${error.message}`)
  );

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = new mongoose.model("Person", personSchema);
const person = new Person({
  name: name,
  number: number,
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log(
    `Please provide the password as an argument: node mongo.js <password>`
  );
  process.exit(1);
}
