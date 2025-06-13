import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ConstructorPage } from '../../pages';
import { IngredientDetails } from '../ingredient-details';
import { Modal } from '../modal';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '../app-header';

const AppWithRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <>
      <AppHeader />
      <Routes location={background || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <div className={styles.app}>
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  </div>
);

export default App;
