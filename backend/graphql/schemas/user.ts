const userSchema = `
  enum Role {
    ADMIN
    USER
  }

  enum Status {
    ACTIVE
    INACTIVE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    status: Status!
    profilePhoto: String
    location: String
    createdAt: String!
  }

  type UserConnection {
    users: [User!]!
    totalPages: Int!
    currentPage: Int!
    totalCount: Int!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: Role
    status: Status
    profilePhoto: String
    location: String
  }

  input UpdateUserInput {
    name: String
    email: String
    role: Role
    status: Status
    profilePhoto: String
    location: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users(
      page: Int!
      limit: Int!
      search: String
      role: Role
      status: Status
    ): UserConnection!
    user(id: ID!): User
    # Changed to Query operation (not Mutation)
    exportUsers(
      search: String
      role: Role
      status: Status
    ): [User!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    deleteMultipleUsers(ids: [ID!]!): Boolean!
    login(email: String!, password: String!): AuthPayload!
    signup(input: CreateUserInput!): AuthPayload!
  }
`;

export default userSchema;