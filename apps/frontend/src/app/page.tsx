'use client';

import { redirect } from 'next/navigation';
import { paths } from 'src/shared/routes/paths.config';

export default function Home() {
  redirect(paths.commercials.restaurants);
}
