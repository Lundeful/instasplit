import {useEffect, useRef} from 'react';

/**
 * A hook that runs an effect only when dependencies change, not on mount.
 * This is a replacement for Mantine's useDidUpdate hook.
 */
export function useDidUpdate(fn: () => void, dependencies: any[] = []) {
    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) {
            fn();
        } else {
            mounted.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}
