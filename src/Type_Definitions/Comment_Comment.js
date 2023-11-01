import gql from 'graphql-tag';

const commentDefs = gql`
  # extend type Query {
  #   postComments: [Comment]!
  #   userComments: [Comment]!
  # }

  extend type Mutation {
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(data: DeleteCommentInput!): Comment!
    updateComment(data: UpdateCommentInput!): Comment!
    voteCommand(data: VoteCommentInput!): Comment!
  }

  extend type Query {
    getCommentsByPostId(data: GetCommentsByPostIdInput): [Comment]!
  }

  input GetCommentsByPostIdInput {
    postId: ID!
  }

  enum voteCommentAction {
    UPVOTE
    DOWNVOTE
  }

  input VoteCommentInput {
    commentId: ID!
    action: voteCommentAction!
  }

  input CreateCommentInput {
    content: String!
    userId: ID!
    postId: ID!
    storyId: ID!
  }

  input DeleteCommentInput {
    commentId: ID!
  }

  input UpdateCommentInput {
    commentId: ID!
    content: String!
  }

  type Comment {
    id: ID!
    content: String!
    createdAt: String!

    userId: User!
    postId: Post!
    storyId: Story!

    votes: Int!
  }
`;

export default commentDefs;
