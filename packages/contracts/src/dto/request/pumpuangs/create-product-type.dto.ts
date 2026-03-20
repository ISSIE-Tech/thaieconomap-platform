import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CONFIG } from '../../../constants';
export class CreateProductTypeDto { @IsString() @IsNotEmpty() @MaxLength(CONFIG.MAX_INPUT_LENGTH) name: string; }
