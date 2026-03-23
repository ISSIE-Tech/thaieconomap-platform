'use client';

import type { ListChildComponentProps } from 'react-window';
import type { DistrictOption } from '../_types/announcements.type';

import * as React from 'react';
import { VariableSizeList } from 'react-window';

import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';

import { ANNOUNCEMENTS_FILTER_TYPES } from '../_constants/location';
import { useAnnouncementsStore } from '../_stores/announcements.store';
import { useAnnouncementsFilter } from '../_hooks/use-announcements-filter';

const LISTBOX_PADDING = 8; // px

function RenderedRow(props: ListChildComponentProps) {
  const { setAnnouncementsLocation } = useAnnouncementsFilter();

  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  const groupStyle = { ...inlineStyle, display: 'flex', alignItems: 'center', cursor: 'pointer' };

  const { closeLocationAutocomplete } = useAnnouncementsStore((state) => state.actions);

  if (Object.prototype.hasOwnProperty.call(dataSet, 'group')) {
    const nameIdPair = dataSet.group as string;
    const [name, id] = nameIdPair.split(':');

    const setProvinceId = () => {
      setAnnouncementsLocation(id, ANNOUNCEMENTS_FILTER_TYPES.PROVINCE_ID);
      closeLocationAutocomplete();
    };

    return (
      <ListSubheader key={dataSet.key} component="div" style={groupStyle} onClick={setProvinceId}>
        <Typography fontWeight="bold">{name}</Typography>
      </ListSubheader>
    );
  }

  const { key, ...optionProps } = dataSet[0];
  const district = dataSet[1] as DistrictOption;

  const setDistrict = () => {
    setAnnouncementsLocation(district.id, ANNOUNCEMENTS_FILTER_TYPES.DISTRICT);
    closeLocationAutocomplete();
  };

  return (
    <Typography
      key={key}
      component="li"
      {...optionProps}
      noWrap
      style={inlineStyle}
      onClick={setDistrict}
    >
      {key}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
export const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const { children, ...other } = props;
    const itemData: React.ReactElement<unknown>[] = [];
    (children as React.ReactElement<unknown>[]).forEach(
      (
        item: React.ReactElement<unknown> & {
          children?: React.ReactElement<unknown>[];
        }
      ) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
      }
    );

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
      noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child: React.ReactElement<unknown>) => {
      if (Object.prototype.hasOwnProperty.call(child, 'group')) {
        return 48;
      }

      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {RenderedRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  }
);
