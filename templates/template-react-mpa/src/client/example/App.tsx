import { useState, useEffect } from 'react';
import { server } from './lib/rpc';

export const App = () => {
  const [sum, setSum] = useState<number | null>(null);

  useEffect(() => {
    server.add(1, 1).then(setSum).catch(console.error);
  }, []);

  return (
    <>
      <h1>This is an awesome example app</h1>
      <h2>Also 1 + 1 = {sum}</h2>
    </>
  );
};
