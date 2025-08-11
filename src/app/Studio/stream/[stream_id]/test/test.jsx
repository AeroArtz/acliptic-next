
import { useEffect, useState } from 'react';

export default async function Page() {

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(`/api/streams/${streamId}/clips`);
                const data = await response.json();
                console.log(data)
            } catch(err) {
                console.log(err)
                setError("Internal Server Error");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData().catch(console.error);
    }, [streamId]);
    
    return (
        <>

        </>
    )

}