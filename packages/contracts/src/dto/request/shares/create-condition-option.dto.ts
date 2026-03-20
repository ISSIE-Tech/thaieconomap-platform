import { IsString, MaxLength } from 'class-validator';
import { CONFIG } from '../../../constants';
export class CreateConditionOptionDto { @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name: string; }
