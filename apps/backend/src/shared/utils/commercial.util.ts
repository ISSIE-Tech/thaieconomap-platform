import { DayName } from '@thaieconomap/contracts';

import { ShopDisplayOpening, ShopOpening } from '../../modules/caching/schemas';

import { minutesSinceMidnightToTime, transfromDayNameFromEnglishToThai } from './transformer.util';

const DAY_NAMES_BY_INDEX: DayName[] = [
  DayName.Sunday,
  DayName.Monday,
  DayName.Tuesday,
  DayName.Wednesday,
  DayName.Thursday,
  DayName.Friday,
  DayName.Saturday,
];

export function getTodayOpening<T extends { day: string }>(opening: T[], date = new Date()): T | undefined {
  const todayName = DAY_NAMES_BY_INDEX[date.getDay()];
  return opening.find(o => o.day === todayName);
}

export function transformOpeningToDisplayOpening(opening: ShopOpening[]): ShopDisplayOpening[] {
  const displayOpening: ShopDisplayOpening[] = [];

  opening.forEach(openingDay => {
    if (openingDay.enable) {
      displayOpening.push({
        days: transfromDayNameFromEnglishToThai(openingDay.day),
        time: openingDay.hours.map(({ open, close }) => {
          return {
            open: minutesSinceMidnightToTime(open),
            close: minutesSinceMidnightToTime(close),
          };
        }),
      });
    }
  });

  return displayOpening;
}

// logic เดิม เก็บไว้ก่อน เผื่อมีการเปลี่ยนกลับ
// function transformOpeningToContinuousDisplayOpening(opening: ShopOpening[]): ShopDisplayOpening[] {
//   let firstPointer = 0;
//   let lastPointer = 1;

//   const displayOpening: ShopDisplayOpening[] = [];

//   while (firstPointer !== 7 && lastPointer !== 7) {
//     while (
//       lastPointer !== 7 &&
//       isShopOpeningContinuous(opening[firstPointer], opening[lastPointer])
//     ) {
//       lastPointer += 1;
//     }

//     if (opening[firstPointer].enable) {
//       const firstDay = transfromDayNameFromEnglishToThai(opening[firstPointer].day);
//       const lastDay = transfromDayNameFromEnglishToThai(opening[lastPointer - 1].day);

//       let openingDays = `${firstDay} - ${lastDay}`;

//       if (openingDays === 'วันอาทิตย์ - วันเสาร์') {
//         openingDays = 'วันอาทิตย์ - วันเสาร์ (ทุกวัน)';
//       }

//       displayOpening.push({
//         days: firstPointer !== lastPointer - 1 ? openingDays : firstDay,
//         time: opening[firstPointer].hours.map(({ open, close }) => {
//           return {
//             open: minutesSinceMidnightToTime(open),
//             close: minutesSinceMidnightToTime(close),
//           };
//         }),
//       });
//     }

//     firstPointer = lastPointer;
//   }

//   return displayOpening;
// }

