import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CarList from "./components/CarList";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";

import { Layout } from "antd";
const { Content } = Layout;

function App() {
  return (
    <div className="App">
      <Content style={{ padding: "0 48px" }}>
        <Router>
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/user/:id" element={<UserDetails />} />
          </Routes>
          <Routes>
            <Route path="/" element={<CarList />} />
          </Routes>
        </Router>
      </Content>
    </div>
  );
}

export default App;
