import { gql } from "@apollo/client";

// In your queries file

 export const GET_USERS = gql`
  query GetUsers(
    $page: Int!
    $limit: Int!
    $search: String
    $role: Role  # Changed from String to Role
    $status: Status  # Changed from String to Status
  ) {
    users(
      page: $page
      limit: $limit
      search: $search
      role: $role
      status: $status
    ) {
      users {
        id
        name
        email
        role
        status
        profilePhoto
        location
        createdAt
      }
      totalPages
      currentPage
      totalCount
    }
  }
`;


export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      status
      profilePhoto
      location
      createdAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      status
    }
  }
`;

export const EXPORT_USERS = gql`
  query ExportUsers(
    $search: String
    $role: Role
    $status: Status
  ) {
    exportUsers(
      search: $search
      role: $role
      status: $status
    ) {
      id
      name
      email
      role
      status
      profilePhoto
      location
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      role
      status
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const DELETE_MULTIPLE_USERS = gql`
  mutation DeleteMultipleUsers($ids: [ID!]!) {
    deleteMultipleUsers(ids: $ids)
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        status
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($input: CreateUserInput!) {
    signup(input: $input) {
      user {
        id
        name
        email
        role
      }
    }
  }
`;
