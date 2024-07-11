import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App, ConfigProvider, theme } from 'antd';
import useStore, { selectors } from './store';
import './locales';
import 'antd/dist/reset.css';
import './assets/style.css';
import MyApp from './MyApp';

export function Container() {
    const darkMode = useStore(selectors.darkMode);

    return (
        <StrictMode>
            <ConfigProvider
                theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.lightAlgorithm }}
            >
                <App>
                    <BrowserRouter future={{ v7_startTransition: true }}>
                        <MyApp />
                    </BrowserRouter>
                </App>
            </ConfigProvider>
        </StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Container />);
