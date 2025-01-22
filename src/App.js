import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/edit/:id" element={<PostForm />} />
          <Route path="/create" element={<PostForm />} />
        </Routes>
      </Router>
  );
}

export default App;
