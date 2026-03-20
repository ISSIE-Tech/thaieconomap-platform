import { CONFIG } from '../../config';
import { UserRole } from '../enums';
import { IFilePolicy } from '../interfaces';
import { buildMultiLineDocDescription } from '../utils';

export const DOC_DESCRIPTION = {
  INVALID_TOKEN: 'Invalid Token.',
  INCLUDE_ROLES: (...roles: string[]) => {
    const formattedRoles = roles.map(role => `\`${role}\``);

    return `For ${formattedRoles.join(', ')} role only.`;
  },
  EXCLUDE_ROLES: (...roles: string[]) => {
    const userRole = Object.values(UserRole).filter(role => !roles.includes(role));
    const formattedRoles = userRole.map(role => `\`${role}\``);

    return `For ${formattedRoles.join(', ')} role only.`;
  },
  ENTITY_NOT_FOUND: (entityName: string) => `${entityName} not found.`,
  INVALID_REQ_BODY: (dto: string) => `Invalid request body type \`${dto}\`.`,
  MUST_BE_MONGOID: (objectId: string) => `**${objectId}** must be mongoID.`,
  UNDER_REVIEW: 'This unit still under review (Not rejected yet)',
  FAILED_TO_MANIPULATE_FILE: 'Failed to manipulate file due to minio error.',
  DOESNT_FAV_YET: 'Doesn\'t favorite yet.',
  HAS_ALREADY_FAV: 'Has already favorite.',
  HAS_BEEN_REJECTED: 'This unit has been rejected.',
  REACH_MAX_FAV: 'Reach maximum amount for favorite.',
  PHONE_NUMBER_BEING_USED: 'Phone number is already in use by another pumpuang',
  PUMPUANG_IS_RUNNING: 'Pumpuang is already running',
  PUMPUANG_IS_NOT_RUNNING: 'Pumpuang is not running',
  TEC_008: '`MANAGER` lacks permission on the responsible district.',
  TEC_017: `TEC-017: invalid districtId in **district** field.`,
  TEC_018: (poilicy: IFilePolicy) => `TEC-018: File larger than ${poilicy.maxSize} btyes.`,
  TEC_019: (poilicy: IFilePolicy) => `TEC-019: MIME type not match ${poilicy.type}.`,
  TEC_029: 'TEC-029:  Required file for main pdf.',
  INVALID_FILE_POLICY: (policy: IFilePolicy, required: boolean = true) =>
    buildMultiLineDocDescription(
      DOC_DESCRIPTION.TEC_018(policy),
      DOC_DESCRIPTION.TEC_019(policy),
      required ? DOC_DESCRIPTION.TEC_029 : undefined,
    ),
  TEC_040: 'TEC-040: Invalid types, condition or shipping element.',
  TEC_048: (entity: string) => `**fileName** not belong to this ${entity}.`,
  TEC_049: 'TEC-049: Don\'t have permission for this set of additional images.',
  TEC_050: `TEC-050: Additional image exceed policy (${CONFIG.MAX_ADDITIONAL_IMAGE} image)`,
  TEC_051: 'TEC-051: **types** are inconsistent with the **category**.',
};
