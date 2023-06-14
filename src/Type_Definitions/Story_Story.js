import gql from 'graphql-tag';

const storyDefs = gql`
  extend type Query {
    allStories: Story
  }

  extend type Mutation {
    createStory(data: CreateStoryInput!): Story!
    deleteStory(data: DeleteStoryInput!): Story!
    deleteAllStory: DeleteAllReturnType!
    updateStory(data: UpdateStoryInput!): Story!
  }

  input CreateStoryInput {
    userId: ID!
    title: String!
    content: String!
  }

  input DeleteStoryInput {
    storyId: ID!
  }

  input UpdateStoryInput {
    storyId: ID!
    title: String
    content: String
  }

  type Story {
    id: ID!
    title: String!
    createdAt: String!
    updatedAt: String!
    content: String!
    points: Int!
    # comments: [Comment!]!

    userId: User!
  }
`;

export default storyDefs;
