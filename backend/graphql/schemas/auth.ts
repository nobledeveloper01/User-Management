const authSchema = `
  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    signup(input: UserInput!): AuthPayload!
  }
`;

export default authSchema;