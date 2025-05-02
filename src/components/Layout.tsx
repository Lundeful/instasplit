import {FC, JSX} from 'react';
import {Footer} from './footer/Footer';
import {Header} from './header/Header';

export const WithLayout: FC<{ children: JSX.Element }> = ({children}) => {
    return (
        <>
            <Header/>
            <div className="min-h-[600px]">{children}</div>
            <Footer/>
        </>
    );
};
