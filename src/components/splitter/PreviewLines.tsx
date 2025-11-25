export const PreviewLines = ({numberOfSplits}: { numberOfSplits: number }) => {
    return (
        <div className="w-full h-full absolute flex justify-evenly items-center pointer-events-none">
            {[...Array(numberOfSplits - 1)].map((_, i) => (
                <div key={i} className="w-0 h-full border-r border-dashed border-white"/>
            ))}
        </div>
    );
};
