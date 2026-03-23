import type { CommercialType } from '../../types';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';

import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';

import { paths } from 'src/routes/paths';

import { ComponentBlock } from 'src/components/custom-blocks';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CommercialTypeItem from './commercial-type-item';
import CommercialTypeCreateForm from './commercial-type-create-form';

// -----–------------------–------------------–------------------–---------------

type Props = {
  data: {
    label: string;
    commercialTypes?: CommercialType[];
    create: {
      mutation: (variables: string, options?: any) => Promise<any>;
      isPending: boolean;
    };
    delete: {
      mutation: UseMutateAsyncFunction<null, Error, string, unknown>;
      isPending: boolean;
    };
  };
};

export default function BaseTypeList({ data }: Props) {
  const { label, commercialTypes, create, delete: deleteMutaiton } = data;

  const renderDemo = (
    <Card>
      <CardHeader title="ตัวอย่าง" />
      <CardContent>
        <ComponentBlock sx={{ flexDirection: 'column', alignItems: 'unset' }}>
          <Autocomplete
            options={commercialTypes?.map((type) => type.name) || []}
            renderInput={(params) => <TextField {...params} label={label} />}
          />
        </ComponentBlock>
      </CardContent>
    </Card>
  );

  const renderRestaurantTypesList = (
    <List
      subheader={<ListSubheader>รายการประเภทร้านอาหาร</ListSubheader>}
      sx={{ bgcolor: 'background.paper' }}
    >
      {commercialTypes?.map((type) => (
        <CommercialTypeItem
          key={type._id}
          commercialType={type}
          deleteMutation={deleteMutaiton.mutation}
          deletePending={deleteMutaiton.isPending}
        />
      ))}
    </List>
  );

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={label}
        links={[
          { name: 'แผนที่ธุรกิจ', href: paths.commercial.dashboard.root },
          { name: 'จัดการตัวเลือก', href: paths.commercial.dashboard.types.root },
          { name: label },
        ]}
        action={
          <CommercialTypeCreateForm
            createMutation={create.mutation}
            isPending={create.isPending}
            label={label}
          />
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container>
        <Grid size={6}>{renderRestaurantTypesList}</Grid>
        <Grid size={6}>{renderDemo}</Grid>
      </Grid>
    </DashboardContent>
  );
}
