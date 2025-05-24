import clsx from 'clsx';
import { useEffect, useState } from 'react';

type MessageProps = {
    id: string
    successMessage?: string
    errorMessage?: string
}
export default function Message({ id, successMessage, errorMessage }: MessageProps) {

    const [show, setShow] = useState(false);

    const hide = () => {
        setShow(false);
    }

    useEffect(() => {
        if (successMessage || errorMessage) {
            setShow(true);
            const timeout = setTimeout(() => hide(), 5000);
            return () => {
                clearTimeout(timeout);
            };
        }else{
            setShow(false);
        }
    }, [id]);

    if (show) {
        return <>
            <div className={clsx(errorMessage ? "bg-red-500" : "bg-green-500", "w-full text-center relative  text-white mb-4 p-4 min-h-14 rounded")}>
                <p>{successMessage || errorMessage}</p>
                <button className={clsx(errorMessage ? "text-red-200" : "text-green-200", 'hover:text-white absolute top-1 right-2 font-bold text-xl leading-none')} onClick={() => hide()}>
                    <span aria-hidden="true">×</span>
                </button>
            </div>

        </>
    }
}
