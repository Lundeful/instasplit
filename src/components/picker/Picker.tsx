import {useNavigate} from 'react-router-dom';
import {Photo, Upload, X} from 'tabler-icons-react';
import {RouteKeys} from '../../App';
import {useRef, useState} from 'react';

const IMAGE_SIZE_IN_MB = 30;
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

type DropStatus = 'idle' | 'accepted' | 'rejected';

export const Picker = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<DropStatus>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        // Check file type
        if (!IMAGE_MIME_TYPES.includes(file.type)) {
            setStatus('rejected');
            console.error('File type not accepted', file.type);
            return;
        }

        // Check file size
        if (file.size > IMAGE_SIZE_IN_MB * 1024 * 1024) {
            setStatus('rejected');
            console.error('File too large', file.size);
            return;
        }

        setStatus('accepted');
        navigate(RouteKeys.Split, {state: file});
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus('idle');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus('idle');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        const file = files[0];

        // Check file type
        if (!IMAGE_MIME_TYPES.includes(file.type)) {
            setStatus('rejected');
            console.error('File type not accepted', file.type);
            return;
        }

        // Check file size
        if (file.size > IMAGE_SIZE_IN_MB * 1024 * 1024) {
            setStatus('rejected');
            console.error('File too large', file.size);
            return;
        }

        setStatus('accepted');
        navigate(RouteKeys.Split, {state: file});
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="my-6">
            <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div className="flex flex-col items-center justify-center min-h-[100px] pointer-events-none">
                    <ImageUploadIcon status={status} size={40}/>

                    <div className="mt-4 text-center">
                        <p className="text-xl">
                            Drag image or click to upload
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            File size should not exceed {IMAGE_SIZE_IN_MB} MB.
                        </p>
                    </div>
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={IMAGE_MIME_TYPES.join(',')}
                onChange={handleFileSelected}
            />
        </div>
    );
};

const ImageUploadIcon = ({status, size}: { status: DropStatus; size: number }) => {
    if (status === 'accepted') {
        return <Upload size={size} className="text-green-500 dark:text-green-400"/>;
    }

    if (status === 'rejected') {
        return <X size={size} className="text-red-500 dark:text-red-400"/>;
    }

    return <Photo size={size} className="text-gray-700 dark:text-gray-300"/>;
};
