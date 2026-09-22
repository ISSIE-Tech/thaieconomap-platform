import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./LeafletMap'), { ssr: false });
export const MapCenter = dynamic(() => import('./MapCenter'), { ssr: false });

export default Map;
