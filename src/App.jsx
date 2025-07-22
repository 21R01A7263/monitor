import { useEffect, useState } from 'react';

function App() {
  const [changedAt, setChangedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/check')
      .then(res => res.json())
      .then(data => {
        if (data.changed) {
          setChangedAt(new Date(data.changedAt).toLocaleString());
        }
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : changedAt ? (
        <div>Class changed at: <span className="font-bold">{changedAt}</span></div>
      ) : (
        <div>No change detected yet.</div>
      )}
    </div>
  );
}

export default App;
