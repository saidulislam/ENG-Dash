import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TeamsView from './pages/TeamsView';
import TeamDetail from './pages/TeamDetail';
import ProjectsView from './pages/ProjectsView';
import ProjectDetail from './pages/ProjectDetail';
import KanbanBoard from './pages/KanbanBoard';
import CapacityView from './pages/CapacityView';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<TeamsView />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/capacity" element={<CapacityView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
