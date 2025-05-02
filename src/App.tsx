import {Hero} from './components/hero/Hero';
import {Route, Routes} from 'react-router-dom';
import {Splitter} from './components/splitter/Splitter';
import {WithLayout} from './components/Layout';
import {NotFound} from './components/notfound/NotFound';
import {NotificationsProvider} from './lib/Notifications';

// Primary color #f6416c
// Background color #1A1B1E

export enum RouteKeys {
    Home = '/',
    Split = '/split',
    NotFound = '*',
}

function App() {
    return (
        <NotificationsProvider>
            <WithLayout>
                <Routes>
                    <Route path={RouteKeys.Home} element={<Hero/>}/>
                    <Route path={RouteKeys.Split} element={<Splitter/>}/>
                    <Route path={RouteKeys.NotFound} element={<NotFound/>}/>
                </Routes>
            </WithLayout>
        </NotificationsProvider>
    );
}

export default App;
