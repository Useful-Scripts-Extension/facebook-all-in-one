import React from 'react';
import useStore, { selectors } from '../store';
import { Button } from 'antd';

export default function ThemeChanger() {
  const darkMode = useStore(selectors.darkMode);
  const setDarkMode = useStore(selectors.setDarkMode);

  return (
    <Button
      type="dashed"
      icon={darkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
      onClick={() => setDarkMode(!darkMode)}
    />
  );
}
