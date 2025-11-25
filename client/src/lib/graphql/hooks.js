import { useMutation, useQuery, useSubscription } from "@apollo/client/react";
import { addMessageMutation, messageAddedSubscription, messagesQuery } from "./queries";

export function useAddMessage() {
    const [mutate] = useMutation(addMessageMutation);

    const addMessage = async (text) => {
        const { data: { message } } = await mutate({
            variables: { text },
        });
        return message;
    };

    return { addMessage };
}

export function useMessages() {
    const { data } = useQuery(messagesQuery);
    useSubscription(messageAddedSubscription, {
        onData: ({ client, data }) => {
            client.cache.updateQuery({ query: messagesQuery }, ({ messages }) => {
                return { messages: [...messages, data.data.message] };
            });
        },
    });
    return {
        messages: data?.messages ?? [],
    };
}
