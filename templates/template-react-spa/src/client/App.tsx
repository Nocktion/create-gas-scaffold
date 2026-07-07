import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { server } from './lib/rpc';

type View = 'home' | 'about';

export const App = () => {
  const [view, setView] = useState<View>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sum, setSum] = useState<number | null>(null);

  useEffect(() => {
    server.add(1, 1).then(setSum).catch(console.error);
  }, []);

  return (
    <main>
      <nav>
        <button onClick={() => setView('home')} disabled={view === 'home'}>
          Home
        </button>
        <button onClick={() => setView('about')} disabled={view === 'about'}>
          About
        </button>
        <button onClick={() => setIsModalOpen(true)}>Open modal</button>
      </nav>

      {view === 'home' ? (
        <section>
          <h1>Home</h1>
          <p>This is an awesome example SPA.</p>
          <p>Also 1 + 1 = {sum}</p>
        </section>
      ) : (
        <section>
          <h1>About</h1>
          <p>Views are switched on the client with no reload.</p>
        </section>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Example modal"
      >
        <h2>Example modal</h2>
        <p>Rendered with react-modal.</p>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </main>
  );
};
