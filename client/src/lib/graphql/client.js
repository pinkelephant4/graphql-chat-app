import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { getAccessToken } from "../auth";

const authLink = new SetContextLink(({ headers }) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        return {
            headers: { ...headers, Authorization: `Bearer ${accessToken}` },
        };
    }
    return { headers };
});

const httpLink = new HttpLink({
    uri: "http://localhost:8080/graphql",
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
