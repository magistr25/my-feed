import './shared/styles/global.scss';

import { Outlet } from 'react-router-dom';

import Header from './widgets/Header/Header';

const App = () => {
    return (
        <div className="app">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default App;

