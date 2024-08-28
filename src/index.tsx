import './index.styl';

import {createRoot} from 'react-dom/client';
import {App} from 'components/App/App';

const appRootNode = document.getElementById('appRoot');
if (!appRootNode) {
    throw new Error('App root is not found!');
}

const reactRoot = createRoot(appRootNode);
reactRoot.render(<App />);
