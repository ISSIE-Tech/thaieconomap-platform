'use client';

import { toast } from 'src/shared/components/snackbar';
import { useBoolean } from 'src/shared/hooks/use-boolean';
import { isApiResponse } from 'src/shared/types/api.type';
import { useAuthToast } from 'src/shared/hooks/use-auth-toast';
import { MaxFavoriteDialog } from 'src/modules/favorites/max-favorite-dialog';

import { IconLabelButton } from './icon-label-btn';

type CallButtonProps = {
  phoneNumber: string;
  highlight?: boolean;
};

export function CallButton({ phoneNumber, highlight = false }: CallButtonProps) {
  return (
    <IconLabelButton
      icon="ic:round-phone"
      label="ติดต่อ"
      highlight={highlight}
      onClick={() => {
        window.location.href = `tel:${phoneNumber}`;
      }}
    />
  );
}

// --------------------------------------------------

type DirectionButtonProps = {
  // null when the user hasn't granted geolocation — the button then links to the
  // destination on Google Maps instead of a turn-by-turn route.
  srcCoord: [number, number] | null;
  dstCoord: [number, number];
  highlight?: boolean;
};

export function formatCoord(unformattedGeoJSON: number[]) {
  return [unformattedGeoJSON[1], unformattedGeoJSON[0]] as [number, number];
}

export function DirectionButton({ srcCoord, dstCoord, highlight }: DirectionButtonProps) {
  // if userLocation exist, shows direction
  // if userLocation doesn't exist (user not allow), shows destination only
  const getDirection = (destination: [number, number], source: [number, number] | null) =>
    source
      ? `https://www.google.com/maps/dir/?api=1&origin=${source[0]},${source[1]}&destination=${destination[0]},${destination[1]}&dir_action=navigate`
      : `https://www.google.com/maps/search/?api=1&query=${destination[0]}%2C${destination[1]}`;

  return (
    <IconLabelButton
      icon="bi:sign-turn-right-fill"
      label="เส้นทาง"
      highlight={highlight}
      onClick={() => window.open(getDirection(dstCoord, srcCoord), '_blank')}
    />
  );
}

// --------------------------------------------------

type FavoriteButtonProps = {
  defaultIsFavorite: boolean;
  favoriteCallback: () => Promise<void>;
  unfavoriteCallback: () => Promise<void>;
};

export function FavoriteButton({
  defaultIsFavorite,
  favoriteCallback,
  unfavoriteCallback,
}: FavoriteButtonProps) {
  const hasFavorite = useBoolean(defaultIsFavorite);
  const maxFavoriteDialog = useBoolean();

  const toastIfNotAuthenticated = useAuthToast();

  const handleFavoriteToggle = async () => {
    if (toastIfNotAuthenticated()) return;

    // this could be in favorite.type but I only used this 2 times (commercial, sharing)
    enum FavoriteAction {
      FAVORITE = 'favorite',
      UNFAVORITE = 'unfavorite',
    }

    // Abstract the common function for making the API request and updating state
    const performFavoriteAction = async (action: FavoriteAction) => {
      try {
        const actionFn = action === 'favorite' ? favoriteCallback : unfavoriteCallback;
        await actionFn();

        hasFavorite.setValue(action === 'favorite');
      } catch (error) {
        // Handle known ApiResponse error or unknown error
        if (isApiResponse(error)) {
          maxFavoriteDialog.onTrue();
        } else {
          toast.error('การบันทึกข้อผิดพลาด');
          console.log('error = ', JSON.stringify(error));
        }
      }
    };

    // If already favorited, perform the "unfavorite" action
    // If not favorited, perform the "favorite" action
    await performFavoriteAction(
      hasFavorite.value ? FavoriteAction.UNFAVORITE : FavoriteAction.FAVORITE
    );
  };

  return (
    <>
      <IconLabelButton
        icon="ic:round-star"
        label="บันทึก"
        highlight={hasFavorite.value}
        onClick={handleFavoriteToggle}
      />

      <MaxFavoriteDialog controller={maxFavoriteDialog} />
    </>
  );
}
