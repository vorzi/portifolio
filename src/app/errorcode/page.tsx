import { Suspense } from 'react';
import ErrorCodeClient from './ErrorCodeClient';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorCodeClient />
        </Suspense>
    );
}