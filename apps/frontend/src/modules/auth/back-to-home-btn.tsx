'use client';

import { useRouter } from 'next/navigation';

import { paths } from 'src/shared/routes/paths.config';
import { BackBtn } from 'src/shared/components/custom-buttons';

export default function BackToHomeBtn() {
  const router = useRouter();

  const redirectToHome = () => {
    router.replace(paths.roots);
  };

  return <BackBtn onClick={redirectToHome} sx={{ position: 'absolute', top: 20, left: 10 }} />;
}
