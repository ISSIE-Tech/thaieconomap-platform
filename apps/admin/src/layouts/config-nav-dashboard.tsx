import { CONFIG } from 'src/config-global';

import { paths } from 'src/routes/paths';

import { SvgColor } from 'src/components/svg-color';

import { workspace } from './config-nav-workspace';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactElement;
  children?: NavItem[];
  disabled?: boolean;
};

type NavSection = {
  subheader: string;
  items: NavItem[];
};

// ----------------------------------------------------------------------

export const economapNavData = [
  {
    subheader: 'ผู้ดูแลระบบ',
    items: [
      {
        title: 'ผู้จัดการ',
        path: paths.user.dashboard.root,
        icon: ICONS.user,
      },
    ],
  },
  {
    subheader: 'การจัดการ',
    items: [
      {
        title: 'แผนที่ธุรกิจ',
        path: paths.commercial.dashboard.root,
        icon: ICONS.ecommerce,
        children: [
          { title: 'รายการ', path: paths.commercial.dashboard.list },
          {
            title: 'สร้างรายการใหม่',
            path: paths.commercial.dashboard.new.root,
            children: [
              { title: 'ร้านอาหาร', path: paths.commercial.dashboard.new.restaurant },
              { title: 'ธุรกิจ', path: paths.commercial.dashboard.new.business },
            ],
          },
          {
            title: 'จัดการตัวเลือก',
            path: paths.commercial.dashboard.types.root, // TODO: Add path
            children: [
              { title: 'ประเภทร้านอาหาร', path: paths.commercial.dashboard.types.restaurant },
              { title: 'ประเภทธุรกิจ', path: paths.commercial.dashboard.types.business },
            ],
          },
        ],
      },
      {
        title: 'ช่วยเหลือแบ่งปัน',
        path: paths['social-sharing'].dashboard.root,
        icon: ICONS.ecommerce,
        children: [
          { title: 'รายการ', path: paths['social-sharing'].dashboard.list },
          { title: 'สร้างรายการใหม่', path: paths['social-sharing'].dashboard.new },
          {
            title: 'จัดการตัวเลือก',
            path: paths['social-sharing'].dashboard.conditions, // TODO: Add path
            children: [
              { title: 'ประเภทสภาพสิ่งของ', path: paths['social-sharing'].dashboard.conditions },
            ],
          },
        ],
      },
      {
        title: 'ประกาศ',
        path: paths.announcements.dashboard.root,
        icon: ICONS.ecommerce,
        children: [
          { title: 'รายการ', path: paths.announcements.dashboard.list },
          { title: 'สร้างรายการใหม่', path: paths.announcements.dashboard.new },
        ],
      },
      {
        title: 'รถพุ่มพวง',
        path: paths.pumpuang.dashboard.root,
        icon: ICONS.ecommerce,
        children: [
          { title: 'รายการ', path: paths.pumpuang.dashboard.list },
          { title: 'ประเภท', path: paths.pumpuang.dashboard.types },
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------------

export const chialShareCarrierNavData = [
  {
    subheader: 'Overview',
    items: [{ title: 'One', path: paths.commercial.dashboard.root, icon: ICONS.dashboard }],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Jobs',
        path: paths.commercial.dashboard.root,
        icon: ICONS.product,
        children: [{ title: 'Four', path: paths.commercial.dashboard.root }],
      },
    ],
  },
];

// ----------------------------------------------------------------------

export const navConfig: Record<workspace, NavSection[]> = {
  [workspace.economap]: economapNavData,
  [workspace.csc]: chialShareCarrierNavData,
};
