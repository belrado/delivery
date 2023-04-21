/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import store from './src/store/store';
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';

const AppRoot = () => {
    return (
        <Provider store={store}>
            {__DEV__ && <FlipperAsyncStorage />}
            <App />
        </Provider>
    );
};

AppRegistry.registerComponent(appName, () => AppRoot);
