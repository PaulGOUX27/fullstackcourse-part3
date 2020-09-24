const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an arguments: node mongo.js <password>');
  process.exit(1);
}

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Please provide the password, name and number as arguments: node mongo.js <password> <name> <number>');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://phonebook:${password}@cluster0.wyc48.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(
  url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook :');
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
  return;
}


const name = process.argv[3];
const number = process.argv[4];
const person = new Person({
  name,
  number,
});

person.save().then(() => {
  console.log(`Added ${name} ${number} to phonebook`);
  mongoose.connection.close();
});
