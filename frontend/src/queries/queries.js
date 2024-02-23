import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation UpsertPerson($id: String!, $firstName: String!, $lastName: String!) {
    addPerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdatePerson($id: String!, $firstName: String!, $lastName: String!) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemovePerson($id: String!) {
    removePerson(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_USERS_WITH_CARS = gql`
  query GetPeopleWithCars {
    peopleWithCars {
      person {
        id
        firstName
        lastName
      }
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

export const GET_USER = gql`
  query GetPeople {
    peopleWithCars {
      person {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_USERS = gql`
  query {
    people {
      id
      firstName
      lastName
    }
  }
`;

export const GET_CARS = gql`
  query {
    cars {
      id
      year
      make
      model
      price
    }
  }
`;

export const CREATE_CAR = gql`
  mutation UpsertCar(
    $id: String!
    $year: String!
    $make: String!
    $model: String!
    $price: String!
    $personId: String!
  ) {
    addCar(
      id: $id
      year: $year
      make: $make
      model: $model
      price: $price
      personId: $personId
    ) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const UPDATE_CAR = gql`
  mutation UpdateCar(
    $id: String!
    $year: String!
    $make: String!
    $model: String!
    $price: String!
    $personId: String!
  ) {
    updateCar(
      id: $id
      year: $year
      make: $make
      model: $model
      price: $price
      personId: $personId
    ) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const DELETE_CAR = gql`
  mutation RemoveCar($id: String!) {
    removeCar(id: $id) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const GET_USER_WITH_CARS = gql`
  query GetPersonWithCars($id: String!) {
    personWithCars(id: $id) {
      person {
        id
        firstName
        lastName
      }
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;
