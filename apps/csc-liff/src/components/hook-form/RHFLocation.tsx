import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '@/config-global';
import { LatLngTuple, icon } from 'leaflet';
import LeafletMap, { MapCenter } from '@/components/leaflet-map';
import React, { useState } from 'react';

import { BackDrawerButton } from '../button';
import { Drawer } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { classNames } from '@/utils/className';
import { useAuth } from '@/auth/useAuth';

const ICON = icon({
  iconUrl: '/assets/icons/map/Marker.svg',
  iconSize: [32, 32],
});

type Props = {
  location: LatLngTuple | null;
  setLocation: (location: LatLngTuple | null) => void;
  errors: any;
};

export default function RHFLocation({ location, setLocation, errors }: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const { location: userLocation } = useAuth();
  const userLatitude = userLocation ? userLocation[0] : DEFAULT_LATITUDE;
  const userLongitude = userLocation ? userLocation[1] : DEFAULT_LONGITUDE;

  // ----------------------------------------------------------------------

  const [center, setCenter] = useState<LatLngTuple | null>(null);

  const [error, setError] = useState(false);

  const handleSelect = () => {
    setOpen(false);
    setLocation(center || [userLatitude, userLongitude]);
  };

  // ----------------------------------------------------------------------

  const LocationPicker = (
    <LeafletMap
      latitude={location ? `${location[0]}` : `${userLatitude}`}
      longitude={location ? `${location[1]}` : `${userLongitude}`}
      zoom={17}
    >
      <MapCenter setCenter={setCenter} />
      {/* For testing the marker is truly center or not */}
      {/* {center && <Marker position={center} icon={ICON} />} */}
    </LeafletMap>
  );

  // Display Lable
  const latitudeLabel = location
    ? Math.floor(location[0] * 10000) / 10000
    : null;
  const longitudeLabel = location
    ? Math.floor(location[1] * 10000) / 10000
    : null;
  const locationLabel = location
    ? `[${latitudeLabel}, ${longitudeLabel}]`
    : 'แตะเพื่อเลือกตำแหน่งในแผนที่';

  // ----------------------------------------------------------------------

  return (
    <div>
      <h4 className="mb-4 text-lg text-ink">
        เลือกตำแหน่งสถานที่ทำงานในแผนที่
      </h4>

      {/* Button */}
      <div>
        <div
          className={classNames(
            'py-8 bg-filling-orange border-2 border-dashed border-border rounded-xl flex justify-center items-center',
            error ? 'border-red' : 'border-cloudy-blue'
          )}
        >
          <button
            className="bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-sm"
            onClick={toggleDrawer(true)}
          >
            {/* <img src={error ? icons.formMarkerError : icons.formMarker} alt='' /> */}
            <FaMapMarkerAlt className={classNames('text-main-orange')} />
            <h6
              className={classNames(
                'text-lg',
                error ? 'text-red' : 'text-granite-50'
              )}
            >
              {location ? locationLabel : 'แตะเพื่อเลือกสถานที่ทำงานในแผนที่'}
            </h6>
          </button>
        </div>
        {/* {errors && <h5 className="mt-2 text-red-400"> ยังไม่ได้เลือกพิกัด</h5>} */}
      </div>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
          },
        }}
      >
        <div className="absolute top-5 left-5 z-[1000]">
          <BackDrawerButton toggleDrawer={toggleDrawer} label={''} />
        </div>

        <div className="flex flex-col h-screen">
          <section className="grow relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-4 -translate-y-1/2 z-[10000] flex items-center gap-2">
              <Image
                src="/assets/icons/map/Marker.svg"
                alt="marker"
                width={32}
                height={32}
              />
              <span className="text-main-orange font-bold text-lg ">
                ที่ทำงาน
              </span>
            </div>

            {LocationPicker}
          </section>

          <section className="bg-white px-6 pt-4 pb-8 shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-t-lg">
            <button className="btn btn-solid w-full" onClick={handleSelect}>
              ยืนยันสถานที่ทำงาน
            </button>
          </section>
        </div>
      </Drawer>
    </div>
  );
}

// ----------------------------------------------------------------------
