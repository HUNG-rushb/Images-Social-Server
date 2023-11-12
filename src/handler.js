// Apollo
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from '@as-integrations/aws-lambda';
// Prisma
import { prisma } from './prisma/database.js';

// Type definitions and resolvers
import typeDefs from './Type_Definitions/_typeDefs.js';
import resolvers from './resolvers/resolvers.js';
import { loggingPlugin } from './logging.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  context: () => {
    return { prisma };
  },
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ...(parseInt(process.env.IS_LOGGING) ? [loggingPlugin] : []),
  ],
  logger: console,
});

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
  {
    middleware: [
      async (event) => {
        console.log('###? received event=' + JSON.stringify(event));
      },
    ],
  },
);
