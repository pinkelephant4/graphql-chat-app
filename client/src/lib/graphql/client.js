import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWsClient } from "graphql-ws";
import { getAccessToken } from "../auth";
import { OperationTypeNode } from "graphql";

const authLink = new SetContextLink(({ headers }) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        return {
            headers: { ...headers, Authorization: `Bearer ${accessToken}` },
        };
    }
    return { headers };
});

const httpLink = authLink.concat(
    new HttpLink({
        uri: "http://localhost:8080/graphql",
    })
);
const wsLink = new GraphQLWsLink(
    createWsClient({
        url: "ws://localhost:8080/graphql",
        connectionParams: () => ({ accessToken: getAccessToken() }),
        //add params as functions coz otherwise access token generated when code loaded, so user may not be logged in then so itll come to be null but as a func, it is run only when conn to be estabished.
    })
);

const splitLink = ApolloLink.split(
    ({ operationType }) => {
        console.log(operationType);
        return operationType === OperationTypeNode.SUBSCRIPTION;
    },
    wsLink,
    httpLink
);

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});
