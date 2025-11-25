import { ApolloProvider } from '@apollo/client/react';
import { useState } from 'react';
import Chat from './components/Chat';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import { getUser, logout } from './lib/auth';
import { apolloClient } from './lib/graphql/client';

function App() {
  const [user, setUser] = useState(getUser);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <ApolloProvider client={apolloClient}>
      <header>
        <NavBar user={user} onLogout={handleLogout} />
      </header>
      <main>
        {Boolean(user) ? (
          <Chat user={user} />
        ) : (
          <LoginForm onLogin={setUser} />
        )}
      </main>
    </ApolloProvider>
  );
}

export default App;
