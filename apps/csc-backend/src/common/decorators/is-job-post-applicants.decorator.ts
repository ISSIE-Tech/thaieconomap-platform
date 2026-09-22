// export function IsJobPostApplicants(validationOptions?: ValidationOptions) {
//   return function(object: any, propertyName: string) {
//     registerDecorator({
//       name: 'isArrayOfBase64',
//       target: object.constructor,
//       propertyName: propertyName,
//       constraints: [],
//       options: validationOptions,
//       validator: {
//         validate(value: any, args: ValidationArguments) {
//           if (!Array.isArray(value)) {
//             return false;
//           }

//           for (const element of value) {
//             if (!isBase64(element)) {
//               return false;
//             }
//           }

//           return true;
//         },
//       },
//     });
//   };
// }
