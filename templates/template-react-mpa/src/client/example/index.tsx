import { createRoot } from 'react-dom/client';
import { App } from './App';

const node = document.getElementById('app');

if (node) {
  const root = createRoot(node);
  root.render(<App />);
}
