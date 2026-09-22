import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

import { UsersService } from '../users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersController } from '../users.controller';
import { AuthService } from 'src/auth/auth.service';
import ShortUniqueId from 'short-unique-id';

interface User {
  _id: {
    $oid: string;
  };
  lineId: string;
  name: string;
  birthDate: {
    $date: string;
  };
  phoneNumber: string;
  experience: string;
}

@Injectable()
export class UsersSeed {
  constructor(
    private readonly usersService: UsersService,
    private readonly authsService: AuthService,
  ) {}

  @Command({ command: 'create:user', describe: 'create a user' })
  async create() {
    const users: any = {};

    for (const user of users) {
      user.birthDate = new Date(user.birthDate);
      user.name = (user.name as string).trim();
      await this.usersService.create(user);
    }
  }

  @Command({ command: 'migrate:users', describe: 'migrate users' })
  async migrate() {
    const data = await fs.readFile('./backup/users.json', 'utf-8');
    const users: User[] = JSON.parse(data);

    for (const user of users) {
      await this.usersService.create({
        lineId: user.lineId,
        // one-off CLI migration: collisions are vanishingly unlikely and the unique index rejects them
        shortId: new ShortUniqueId({ length: 6 }).randomUUID(),
        profileImageUrl:
          'https://api-storage.thaieconomap.com/chial-share/Admin-Profile-PNG-Clipart.png',
        name: user.name,
        birthDate: new Date(user.birthDate.$date),
        phoneNumber: user.phoneNumber,
        experiences: user.experience,
      });
    }

    console.log('migrate users successfully');
  }
}
