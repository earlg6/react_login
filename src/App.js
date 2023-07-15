import Register from './components/AdminPages/Register';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Home from './components/AdminPages/Home';
import MediaManager from './components/AdminPages/MediaManager';
import RequireAuth from './components/RequireAuth';


function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {/*public routes*/}
          <Route path="login" element={<Login />} />

          {/*Catch all*/}
          <Route path="*" element={<Missing />} />

          {/*protect routes*/}
          <Route element={<RequireAuth/>}>
            <Route path="admin" element={<Home />}>
              <Route path="media_manager" element={<MediaManager />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    );
}

export default App;
