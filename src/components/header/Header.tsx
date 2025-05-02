import {Link} from 'react-router-dom';
import Logo from '../../assets/instasplit-logo.svg';

export const Header = () => {
    return (
        <header className="h-[60px]">
            <div className="container mx-auto h-full flex justify-between items-center px-4">
                <Link to='/' className="hover:opacity-80">
                    <img src={Logo} alt="InstaSplit Logo" className="h-[30px] w-[30px]"/>
                </Link>
            </div>
        </header>
    );
};
