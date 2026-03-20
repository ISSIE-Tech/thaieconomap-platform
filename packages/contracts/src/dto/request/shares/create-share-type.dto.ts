import { IsString, MaxLength } from 'class-validator';
import { CONFIG } from '../../../constants';
export class CreateShareTypeDto { @IsString() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name: string; }
