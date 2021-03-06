import { ApolloServer } from "apollo-server-cloudflare";
import { graphqlCloudflare } from "apollo-server-cloudflare/dist/cloudflareApollo";
import schema from "../schema";
import authCheck from "../utils/authCheck";

const server = new ApolloServer({
  schema,
  introspection: true, // enable introspection in apollo studio
  csrfPrevention: true, // enable csrf prevention in apollo studio
  cache: "bounded",
  context: async ({ request }) => authCheck(request),
});

const serverStartTrigger = server.start();

const apolloHandler = async (request) => {
  await serverStartTrigger;
  const result = await graphqlCloudflare(
    () => server.createGraphQLServerOptions(request),
    server.csrfPreventionRequestHeaders
  )(request);
  return result;
};

export default apolloHandler;
