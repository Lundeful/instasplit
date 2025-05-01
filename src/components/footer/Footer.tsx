import Logo from '../../assets/instasplit-logo.svg';

export const Footer = () => {
  return (
    <footer className="mt-60 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center py-8 px-4 xs:flex-col">
        <img src={Logo} alt="InstaSplit Logo" className="h-[30px] w-[30px]" />
        <div className="xs:mt-4">
          <a href='https://www.christofferlund.com' target='_blank' rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <p>Made by Christoffer Lund</p>
          </a>
        </div>
      </div>
    </footer>
  );
};
