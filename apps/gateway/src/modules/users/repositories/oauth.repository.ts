import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { EntityRepository } from '../../../shared/repositories';
import { Oauth, OauthDocument } from '../schemas';

@Injectable()
export class OauthRepository extends EntityRepository<OauthDocument> {
  constructor(@InjectModel(Oauth.name) private readonly oauthModel: Model<OauthDocument>) {
    super(oauthModel);
  }
}
