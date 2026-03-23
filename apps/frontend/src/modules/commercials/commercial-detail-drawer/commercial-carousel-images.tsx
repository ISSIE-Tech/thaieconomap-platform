'use client';

import { Image } from 'src/shared/components/image';
import { Carousel, useCarousel } from 'src/shared/components/carousel';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  title: string;
  imageUrls: string[];
};

export default function CommercialCarouselImages({ title, imageUrls }: Props) {
  // slidesToShow is how long each image is
  const carousel = useCarousel({
    loop: true,
    slidesToShow: '70%',
    slideSpacing: '20px',
  });

  return (
    <Stack spacing={2} px={3}>
      <Typography variant="body1" fontWeight="bold">
        {title}
      </Typography>

      {/* use width: '100%' to make everything has the same width and height */}
      <Carousel carousel={carousel} sx={{ width: '100%' }}>
        {imageUrls.map((item) => (
          <Image
            key={item}
            alt={item}
            src={item}
            ratio="4/3"
            sx={{
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        ))}
      </Carousel>
    </Stack>
  );
}
