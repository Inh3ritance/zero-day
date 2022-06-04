import React, { useCallback, useState } from 'react';
import Home from './home';
import Login from './login';

const App = () => {
  const [approval, setApproval] = useState(false);

  const approve = useCallback(() => {
    setApproval(true);
  }, [setApproval]);

  return approval ? <Home /> : <Login approve={approve} />;
};

export default App;
