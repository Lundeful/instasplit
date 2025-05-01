import { Link } from 'react-router-dom';
import { RouteKeys } from '../../App';
import { Button } from '../ui/button';

export const NotFound = () => {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="text-center font-black text-[220px] leading-none mb-6 text-gray-200 dark:text-gray-700 sm:text-[120px]">404</div>
      <h1 className="font-sans text-center font-black text-4xl sm:text-3xl">You have wandered off track.</h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg text-center max-w-[500px] mx-auto mt-4 mb-6">
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page could've been moved to another URL.
      </p>
      <div className="flex justify-center">
        <Button variant="ghost" size="lg" asChild>
          <Link to={RouteKeys.Home}>
            Take me back to home page
          </Link>
        </Button>
      </div>
    </div>
  );
};
