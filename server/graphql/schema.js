import pkg from "lodash";
const { find, remove } = pkg;

const people = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson"
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith"
  },
  {
    id: "3",
    firstName: "Charlie",
    lastName: "Davis"
  }
];

const cars = [
  {
    id: "1",
    year: "2019",
    make: "Mazda",
    model: "CX-5",
    price: "28000",
    personId: "1"
  },
  {
    id: "2",
    year: "2018",
    make: "Subaru",
    model: "Forester",
    price: "22000",
    personId: "1"
  },
  {
    id: "3",
    year: "2017",
    make: "Chevrolet",
    model: "Malibu",
    price: "24000",
    personId: "1"
  },
  {
    id: "4",
    year: "2019",
    make: "Nissan",
    model: "Altima",
    price: "27000",
    personId: "2"
  },
  {
    id: "5",
    year: "2018",
    make: "Hyundai",
    model: "Tucson",
    price: "26000",
    personId: "2"
  },
  {
    id: "6",
    year: "2017",
    make: "Ford",
    model: "Escape",
    price: "25000",
    personId: "2"
  },
  {
    id: "7",
    year: "2019",
    make: "GMC",
    model: "Terrain",
    price: "29000",
    personId: "3"
  },
  {
    id: "8",
    year: "2018",
    make: "Jeep",
    model: "Cherokee",
    price: "31000",
    personId: "3"
  },
  {
    id: "9",
    year: "2017",
    make: "Tesla",
    model: "Model 3",
    price: "35000",
    personId: "3"
  }
];

const typeDefs = `
  type Person {
    id: String!
    firstName: String
    lastName: String
  }

  type Car {
    id: String!
    year: String
    make: String
    model: String
    price: String
    personId: String
  }

  type PersonWithCars {
    person: Person,
    cars: [Car]
  }

  type Query {
    people: [Person]
    cars: [Car]
    peopleWithCars: [PersonWithCars]
    personWithCars(id: String!): PersonWithCars
  }

  type Mutation {
    addPerson(id: String!, firstName: String!, lastName: String!): Person
    updatePerson(id: String!, firstName: String!, lastName: String!): Person
    removePerson(id: String!): Person
    addCar(id: String!, year: String!, make: String!, model: String!, price: String!, personId: String!): Car
    updateCar(id: String!, year: String!, make: String!, model: String!, price: String!, personId: String!): Car
    removeCar(id: String!): Car
  }
`;

const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    peopleWithCars: () => {
      return people.map(person => {
        return {
          person,
          cars: cars.filter(car => car.personId === person.id)
        };
      });
    },
    personWithCars: (root, args) => {
      const person = find(people, { id: args.id });

      if (!person) {
        throw new Error(`Couldn't find person with id ${args.id}`);
      }

      return {
        person,
        cars: cars.filter(car => car.personId === args.id)
      };
    }
  },
  Mutation: {
    // ========================> people
    addPerson: (root, args) => {
      const newPerson = {
        id: args.id,
        firstName: args.firstName,
        lastName: args.lastName
      };
      people.push(newPerson);
      return newPerson;
    },

    updatePerson: (root, args) => {
      const person = find(people, { id: args.id });

      if (!person) {
        throw new Error(`Couldn't find person with id ${args.id}`);
      }

      person.firstName = args.firstName;
      person.lastName = args.lastName;

      return person;
    },

    removePerson: (root, args) => {
      const removedPerson = find(people, { id: args.id });

      if (!removedPerson) {
        throw new Error(`Couldn't find person with id ${args.id}`);
      }

      // remove all cars of this person
      remove(cars, c => {
        return c.personId === removedPerson.id;
      });

      remove(people, c => {
        return c.id === removedPerson.id;
      });

      return removedPerson;
    },

    // ========================> cars

    addCar: (root, args) => {
      const newCar = {
        id: args.id,
        year: args.year,
        make: args.make,
        model: args.model,
        price: args.price,
        personId: args.personId
      };
      cars.push(newCar);
      return newCar;
    },

    updateCar: (root, args) => {
      const car = find(cars, { id: args.id });

      if (!car) {
        throw new Error(`Couldn't find car with id ${args.id}`);
      }

      car.year = args.year;
      car.make = args.make;
      car.model = args.model;
      car.price = args.price;
      car.personId = args.personId;

      return car;
    },
    removeCar: (root, args) => {
      const removedCar = find(cars, { id: args.id });

      if (!removedCar) {
        throw new Error(`Couldn't find car with id ${args.id}`);
      }

      remove(cars, c => {
        return c.id === removedCar.id;
      });

      return removedCar;
    }
  }
};

export { typeDefs, resolvers };
