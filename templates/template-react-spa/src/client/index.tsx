import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { App } from './App';

const node = document.getElementById('app');

if (node) {
  Modal.setAppElement(node);

  const root = createRoot(node);
  root.render(<App />);
}
