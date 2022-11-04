import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// import Home from './pages/Home';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import Nav from './components/Nav';
import { Home, Signup, Login, Profile } from "./pages/index.js";
import { Nav } from "./components/index.js";
import { useQuery } from "@apollo/client";
import { QUERY_USER } from "./utils/queries";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [user, setUser] = useState(null)
  const { loading, data } = useQuery(QUERY_USER);
  setUser(data?.user || null);
  const UserContext = createContext();
  return (
    <ApolloProvider client={client}>
      <UserContext.Provider value={user}>
      <Router>
        <div>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
          <Routes>
            <Route path="/signup" element={<Signup />} />
          </Routes>
          <Routes>
              <Route path="/profile" user={user} element={<Profile />} />
          </Routes>
        </div>
        </Router>
      </UserContext.Provider>
    </ApolloProvider>
  );
}

export default App;
