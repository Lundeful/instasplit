import 'react-image-crop/dist/ReactCrop.css';
import {useCallback, useEffect, useRef, useState} from 'react';
import ReactCrop, {Crop, PixelCrop} from 'react-image-crop';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {ArrowBackUp, ArrowsHorizontal, ArrowsVertical, Crop as CropIcon, X} from 'tabler-icons-react';
import {RouteKeys} from '../../App';
import {IncrementedNumberInput} from '../formcomponents/IncrementedNumberInput';
import {AspectRatios} from './types';
import {getCrop} from '@/utilities/getCrop.ts';
import {getAspectRatio} from '@/utilities/getAspectRatio.ts';
import {PreviewLines} from './PreviewLines';
import {getCroppedImages} from '@/utilities/imageCropper.ts';
import {saveAs} from 'file-saver';
import JSZip from 'jszip';
import {useDidUpdate} from '@/lib/useDidUpdate.ts';
import {useNotifications} from '../../lib/Notifications';
import {Button} from '../ui/button';
import {Checkbox} from '../ui/checkbox';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '../ui/select';

export const Splitter = () => {
    const {showNotification} = useNotifications();

    // Route state
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Image and crop state
    const imgRef = useRef<HTMLImageElement>(null);
    const [imgSrc, setImgSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>({width: 100, height: 50, x: 0, y: 25, unit: '%'});
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const [aspect, setAspect] = useState<number | undefined>();

    // Crop tools state
    const [showTools, setShowTools] = useState(false);
    const [showPreviewLines, setShowPreviewLines] = useState(true);
    const [numberOfSplits, setNumberOfSplits] = useState(2);
    const [desiredRatio, setDesiredRatio] = useState<string>('free');
    const [customRatio, setCustomRatio] = useState<{ width: number; height: number }>({width: 1, height: 1});
    const [useZip, setUseZip] = useState(true);

    useEffect(() => {
        setAspect(getAspectRatio(desiredRatio, numberOfSplits, customRatio, imgRef.current?.width, imgRef.current?.height));
    }, [desiredRatio, numberOfSplits, customRatio]);

    useDidUpdate(() => {
        if (desiredRatio === 'free' || !aspect || !imgRef.current) return;
        const {width, height} = imgRef.current;
        const crop = getCrop(width, height, aspect);
        setCrop(crop);
        setCompletedCrop(crop);
    }, [aspect]);

    const loadImageData = useCallback(() => {
        // If state was not passed then we GTFO
        if (!location.state) {
            navigate(RouteKeys.Home);
        }
        const file = location.state as File;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImgSrc(reader.result?.toString() || '');
            setLoading(false);
        });

        reader.readAsDataURL(file);
    }, [location.state, navigate]);

    useEffect(loadImageData, [loadImageData]);

    const handleSubmit = async () => {
        if (!completedCrop || !imgRef.current) {
            console.error('Missing image reference or completed crop');
            showNotification({
                title: 'Error!',
                message: 'There was an error while cropping and saving. Please try again',
                type: 'error',
            });
            return;
        }

        try {
            const file = location.state as File;
            const originalFileName = file.name.split('.');
            originalFileName.pop();
            const images = await getCroppedImages(imgRef.current, numberOfSplits, completedCrop as PixelCrop, file.type);
            if (useZip) {
                // Zip file is recommended for mobile users
                var zip = new JSZip();
                images.forEach((image, i) => {
                    const fileType = image.type.split('/').pop() ?? 'jpg';
                    zip.file(`${originalFileName}-instasplit-${i + 1}.${fileType}`, image);
                });

                zip.generateAsync({type: 'blob'}).then(content => {
                    saveAs(content, `${originalFileName}-instasplit.zip`);
                });

                return;
            }

            images.forEach((image, i) => {
                saveAs(image, `${originalFileName}-instasplit-${i + 1}`);
            });
        } catch (e) {
            console.error(e);
            showNotification({
                title: 'Error!',
                message: 'There was an error while cropping and saving. Please try again',
                type: 'error',
            });
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="mb-4">
                <div className="flex justify-between items-center my-2">
                    <Button variant="outline" asChild>
                        <Link to={RouteKeys.Home}>
                            <ArrowBackUp className="mr-2"/>
                            Back
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => setShowTools(!showTools)}>
                        <CropIcon className="mr-2"/>
                        Settings
                    </Button>
                    <Button disabled={!completedCrop} onClick={handleSubmit}>
                        Split
                    </Button>
                </div>

                {showTools && (
                    <div className="mt-4">
                        <div className="flex flex-col items-center">
                            <div className="flex flex-wrap gap-8 items-start">
                                <IncrementedNumberInput
                                    label='Split into'
                                    value={numberOfSplits}
                                    setValue={setNumberOfSplits}
                                    max={20}
                                    min={1}
                                />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Preview lines</label>
                                    <div
                                        className="flex h-9 px-4 py-2 border rounded-md bg-background hover:bg-accent hover:text-accent-foreground items-center space-x-2 cursor-pointer">
                                        <Checkbox
                                            id="preview-lines"
                                            className="size-5"
                                            checked={showPreviewLines}
                                            onCheckedChange={(checked) => setShowPreviewLines(checked === true)}
                                        />
                                        <label htmlFor="preview-lines" className="text-sm cursor-pointer">Show</label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Save as .zip</label>
                                    <div
                                        className="flex h-9 px-4 py-2 border rounded-md bg-background hover:bg-accent hover:text-accent-foreground items-center space-x-2 cursor-pointer">
                                        <Checkbox
                                            id="use-zip"
                                            className="size-5"
                                            checked={useZip}
                                            onCheckedChange={(checked) => {
                                                const isChecked = checked === true;
                                                if (window.innerWidth < 700 && !isChecked) {
                                                    showNotification({
                                                        title: 'Important message for mobile users!',
                                                        type: 'warning',
                                                        message:
                                                            'Due to mobile browser limitations it is recommended you download as a zip.\nNot using a zip file might result in you only downloading the last file.',
                                                        autoClose: 0,
                                                    });
                                                }
                                                setUseZip(isChecked);
                                            }}
                                        />
                                        <label htmlFor="use-zip" className="text-sm cursor-pointer">Enable</label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Aspect ratio</label>
                                    {desiredRatio === 'custom' ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center">
                                                <ArrowsHorizontal className="mr-2" size={16}/>
                                                <input
                                                    type="number"
                                                    className="w-20 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                                    value={customRatio.width}
                                                    min={1}
                                                    max={1000}
                                                    onChange={(e) => setCustomRatio({
                                                        width: parseInt(e.target.value) || customRatio.width,
                                                        height: customRatio.height
                                                    })}
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <ArrowsVertical className="mr-2" size={16}/>
                                                <input
                                                    type="number"
                                                    className="w-20 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                                    value={customRatio.height}
                                                    min={1}
                                                    max={1000}
                                                    onChange={(e) => setCustomRatio({
                                                        width: customRatio.width,
                                                        height: parseInt(e.target.value) || customRatio.height
                                                    })}
                                                />
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => setDesiredRatio('free')}
                                            >
                                                <X/>
                                            </Button>
                                        </div>
                                    ) : (
                                        <Select onValueChange={(value) => setDesiredRatio(value)}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Select aspect ratio"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AspectRatios.map((ratio) => (
                                                    <SelectItem key={ratio.value} value={ratio.value}>
                                                        {ratio.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!!imgSrc && (
                <div className="flex justify-center items-center my-8">
                    <ReactCrop
                        renderSelectionAddon={() => (showPreviewLines ? <PreviewLines numberOfSplits={numberOfSplits}/> : null)}
                        keepSelection
                        crop={crop}
                        onChange={(pixelCrop) => setCrop(pixelCrop)}
                        onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                        aspect={aspect}
                        style={{alignSelf: 'center', margin: 'auto'}}
                    >
                        <div className="relative">
                            <img
                                ref={imgRef}
                                src={imgSrc}
                                alt="Your image"
                                style={{maxHeight: 600}}
                                onLoad={() => setDesiredRatio('original')}
                            />
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                    </ReactCrop>
                </div>
            )}
        </div>
    );
};
