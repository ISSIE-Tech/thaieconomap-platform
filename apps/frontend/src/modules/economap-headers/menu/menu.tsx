'use client';

import { useBoolean } from 'src/shared/hooks/use-boolean';

import { MenuBtn } from './menu-btn';
import { MenuDrawer } from './menu-drawer';

// -------------------------------------------------------------

export function Menu() {
  const menuController = useBoolean();

  return (
    <>
      <MenuBtn onClick={menuController.onToggle} />

      <MenuDrawer menuController={menuController} />
    </>
  );
}
