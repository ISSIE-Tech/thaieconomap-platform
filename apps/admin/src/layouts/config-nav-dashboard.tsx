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
  roles?: string[];
};

type NavSection = {
  subheader: string;
  items: NavItem[];
  roles?: string[];
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
        icon: ICONS.product,
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
        title: 'ร้านค้าจากตามสั่งตามส่ง',
        path: paths['tamsang-shops'].dashboard.root,
        icon: ICONS.order,
        roles: ['ADMIN'],
      },
      {
        title: 'ประกาศ',
        path: paths.announcements.dashboard.root,
        icon: ICONS.blog,
        children: [
          { title: 'รายการ', path: paths.announcements.dashboard.list },
          { title: 'สร้างรายการใหม่', path: paths.announcements.dashboard.new },
        ],
      },
      {
        title: 'เนื้อหาเว็บไซต์',
        path: paths['site-contents'].dashboard.root,
        icon: ICONS.file,
        roles: ['ADMIN'],
        children: [
          { title: 'เกี่ยวกับเรา', path: paths['site-contents'].dashboard.about },
          { title: 'ข้อกำหนดการใช้งาน', path: paths['site-contents'].dashboard.terms },
          { title: 'นโยบายความเป็นส่วนตัว', path: paths['site-contents'].dashboard.privacy },
        ],
      },
      {
        title: 'รถพุ่มพวง',
        path: paths.pumpuang.dashboard.root,
        icon: ICONS.tour,
        children: [
          { title: 'รายการ', path: paths.pumpuang.dashboard.list },
          { title: 'สร้างรายการใหม่', path: paths.pumpuang.dashboard.new },
          { title: 'ประเภท', path: paths.pumpuang.dashboard.types },
        ],
      },
    ],
  },
  {
    subheader: 'นักพัฒนา',
    roles: ['DEVELOPER'],
    items: [
      {
        title: 'FCM Logs',
        path: paths['fcm-logs'].dashboard.list,
        icon: ICONS.analytics,
        roles: ['DEVELOPER'],
      },
      {
        title: 'OTP Logs',
        path: paths['otp-logs'].dashboard.list,
        icon: ICONS.lock,
        roles: ['DEVELOPER'],
      },
    ],
  },
];

// ----------------------------------------------------------------------

export const chialShareCarrierNavData: NavSection[] = [
  {
    subheader: 'ผู้ดูแลระบบ',
    roles: ['ADMIN'],
    items: [{ title: 'ผู้ใช้งาน', path: paths.csc.dashboard.users, icon: ICONS.user, roles: ['ADMIN'] }],
  },
  {
    subheader: 'การจัดการ',
    items: [
      {
        title: 'งาน',
        path: paths.csc.dashboard.jobs.root,
        icon: ICONS.job,
        children: [
          { title: 'รายการ', path: paths.csc.dashboard.jobs.list },
          { title: 'รออนุมัติ', path: paths.csc.dashboard.jobs.pending },
          { title: 'ลบ', path: paths.csc.dashboard.jobs.deleted },
          {
            title: 'ตัวเลือก',
            path: paths.csc.dashboard.jobs.options.root,
            roles: ['ADMIN'],
            children: [
              { title: 'ประเภทงาน', path: paths.csc.dashboard.jobs.options.categories },
              { title: 'หน่วยค่าตอบแทน', path: paths.csc.dashboard.jobs.options.wageUnits },
              { title: '5 อันดับ', path: paths.csc.dashboard.jobs.options.top5 },
            ],
          },
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------------

export const navConfig: Record<workspace, NavSection[]> = {
  [workspace.economap]: economapNavData,
  [workspace.csc]: chialShareCarrierNavData,
};

// ----------------------------------------------------------------------

function filterNavItems(items: NavItem[], userRole: string): NavItem[] {
  // DEVELOPER inherits all ADMIN permissions
  const effectiveRoles = userRole === 'DEVELOPER' ? [userRole, 'ADMIN'] : [userRole];

  return items
    .filter((item) => !item.roles || item.roles.some((r) => effectiveRoles.includes(r)))
    .map((item) => ({
      ...item,
      ...(item.children && { children: filterNavItems(item.children, userRole) }),
    }));
}

export function filterNavByRole(sections: NavSection[], userRole: string): NavSection[] {
  const effectiveRoles = userRole === 'DEVELOPER' ? [userRole, 'ADMIN'] : [userRole];

  return sections
    .filter((section) => !section.roles || section.roles.some((r) => effectiveRoles.includes(r)))
    .map((section) => ({
      ...section,
      items: filterNavItems(section.items, userRole),
    }))
    .filter((section) => section.items.length > 0);
}
