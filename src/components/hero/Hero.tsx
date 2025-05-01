import {Picker} from '../picker/Picker';

export function Hero() {
    return (
        <div className="relative">
            <div className="relative max-w-[700px] mx-auto py-[100px] pb-[120px] px-4 md:px-6 sm:py-[25px] sm:pb-[80px]">
                <h1 className="font-sans text-6xl font-black leading-tight m-0 p-0 text-black dark:text-white sm:text-4xl sm:leading-normal">
                    Use{' '}
                    <span className="bg-gradient-to-r from-[#f6416c] to-[#f86789] text-transparent bg-clip-text">
                        InstaSplit
                    </span>{' '}
                    to show off your work in a whole new way.
                </h1>

                <p className="mt-8 text-2xl text-gray-500 dark:text-gray-400 sm:text-lg">
                    Split one image into multiple images with a perfect seam and create those amazing panoramas on Instagram.
                </p>
                <Picker/>
            </div>
        </div>
    );
}
