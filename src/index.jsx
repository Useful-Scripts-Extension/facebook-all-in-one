import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App, ConfigProvider, theme } from 'antd';
import useStore, { selectors } from './store';
import './locales';
import 'antd/dist/reset.css';
import './assets/style.css';
import MyApp from './MyApp';

export function Container() {
    const darkMode = useStore(selectors.darkMode);

    return (
        // <React.StrictMode>
        <ConfigProvider
            theme={{
                algorithm: darkMode ? theme.darkAlgorithm : theme.lightAlgorithm,
            }}
        >
            <App>
                <HashRouter>
                    <MyApp />
                </HashRouter>
            </App>
        </ConfigProvider>
        // </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Container />);
