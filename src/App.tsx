import { Outlet, useLocation } from 'react-router-dom';

import Header from '@/widgets/Header/Header';

const App = () => {
    const location = useLocation();
    const hideHeaderPaths = ['/login']; // Пути, где не нужно показывать Header

    return (
        <div className="app">
            {!hideHeaderPaths.includes(location.pathname) && <Header />}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default App;


