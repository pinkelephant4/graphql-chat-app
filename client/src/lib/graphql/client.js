import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { getAccessToken } from "../auth";

const httpLink = new HttpLink({ uri: "http://localhost:8080/graphql" });

const authLink = new SetContextLink(({ headers }) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        return {
            headers: { ...headers, Authorization: `Bearer ${accessToken}` },
        };
    }
    return { headers };
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
