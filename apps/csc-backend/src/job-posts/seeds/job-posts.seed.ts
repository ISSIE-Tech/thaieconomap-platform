import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { JobPostsService } from '../services/job-posts.service';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs/promises';
import { CreatePendingJobPostsDto } from '../dtos/create-pending-job-posts.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { DistrictsService } from 'src/districts/districts.service';
import { PendingJobPostsService } from '../services/pending-job-post.service';

interface LegacyJobPost {
  title: string;
  category: {
    $oid: string;
  };
  description: string;
  applicants: {
    number: number;
    _id: {
      $oid: string;
    };
    candidates: string[];
    accepted: string[];
    rejected: string[];
  };
  wage: {
    amount: number;
    unit: string;
  };
  startDate: {
    $date: string;
  };
  endDate: {
    $date: string;
  };
  closeDate: {
    $date: string;
  };
  workload: string;
  qualification: string;
  imageUrls: string[];
  location: {
    latitude: string;
    longitude: string;
  };
  createdBy: {
    $oid: string;
  };
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
}
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
export class JobPostsSeed {
  constructor(
    private readonly jobPostsService: JobPostsService,
    private readonly pendingJobPostsService: PendingJobPostsService,
    private readonly usersService: UsersService,
    private readonly districtsService: DistrictsService,
  ) {}

  //   @Command({ command: 'create:job_posts', describe: 'create job post' })
  //   async insert() {
  //     const jobPosts = [
  //       {
  //         "owner": "\u0e2a\u0e38\u0e02\u0e2a\u0e31\u0e19\u0e15\u0e4c \u0e40\u0e14\u0e0a\u0e2d\u0e38\u0e1b",
  //         "title": "\u0e0a\u0e48\u0e32\u0e07\u0e1b\u0e23\u0e30\u0e1b\u0e32",
  //         "category": "\u0e07\u0e32\u0e19\u0e0a\u0e48\u0e32\u0e07",
  //         "description": "\u0e04\u0e2d\u0e22\u0e0b\u0e48\u0e2d\u0e21\u0e1b\u0e23\u0e30\u0e1b\u0e32\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19\u0e40\u0e21\u0e37\u0e48\u0e2d\u0e21\u0e35\u0e1b\u0e31\u0e0d\u0e2b\u0e32 \u0e43\u0e2b\u0e49\u0e04\u0e48\u0e32\u0e15\u0e2d\u0e1a\u0e41\u0e17\u0e19\u0e23\u0e32\u0e22\u0e27\u0e31\u0e19 \u0e21\u0e35\u0e17\u0e35\u0e48\u0e1e\u0e31\u0e01\u0e43\u0e2b\u0e49",
  //         "number": 2,
  //         "wage": "350 \u0e1a\u0e32\u0e17/\u0e27\u0e31\u0e19",
  //         "startDate": "2023-04-02 00:00:00",
  //         "endDate": "2024-04-02 00:00:00",
  //         "closeDate": "2023-03-20 00:00:00",
  //         "workload": " - \u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a\u0e1b\u0e23\u0e30\u0e1b\u0e32\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19\n- \u0e0b\u0e48\u0e2d\u0e21\u0e1a\u0e33\u0e23\u0e38\u0e07\u0e43\u0e2b\u0e49\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e44\u0e14\u0e49\u0e2d\u0e22\u0e39\u0e48\u0e40\u0e2a\u0e21\u0e2d\n- \u0e14\u0e39\u0e41\u0e25\u0e1b\u0e23\u0e30\u0e1b\u0e32\u0e02\u0e2d\u0e07\u0e25\u0e39\u0e01\u0e1a\u0e49\u0e32\u0e19",
  //         "qualification": "- \u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14\u0e27\u0e38\u0e12\u0e34\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32\n- \u0e21\u0e35\u0e04\u0e27\u0e32\u0e21\u0e23\u0e39\u0e49\u0e40\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e23\u0e30\u0e1a\u0e1a\u0e1b\u0e23\u0e30\u0e1b\u0e32\n- \u0e21\u0e35\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c\n- \u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e17\u0e33\u0e07\u0e32\u0e19\u0e25\u0e48\u0e27\u0e07\u0e40\u0e27\u0e25\u0e32\u0e44\u0e14\u0e49",
  //         "latitude": 13.752,
  //         "longitude": 100.507
  //       },
  //       {
  //         "owner": "\u0e2a\u0e38\u0e02\u0e2a\u0e31\u0e19\u0e15\u0e4c \u0e40\u0e14\u0e0a\u0e2d\u0e38\u0e1b",
  //         "title": "\u0e0a\u0e48\u0e32\u0e07\u0e41\u0e2d\u0e23\u0e4c",
  //         "category": "\u0e07\u0e32\u0e19\u0e0a\u0e48\u0e32\u0e07",
  //         "description": "\u0e25\u0e49\u0e32\u0e07\u0e41\u0e2d\u0e23\u0e4c \u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07\u0e41\u0e2d\u0e23\u0e4c \u0e22\u0e49\u0e32\u0e22\u0e41\u0e2d\u0e23\u0e4c \u0e0b\u0e48\u0e2d\u0e21\u0e41\u0e2d\u0e23\u0e4c \u0e43\u0e2b\u0e49\u0e40\u0e07\u0e34\u0e19\u0e40\u0e1b\u0e47\u0e19\u0e23\u0e32\u0e22\u0e40\u0e14\u0e37\u0e2d\u0e19 \u0e40\u0e02\u0e49\u0e32\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e17\u0e35\u0e48\u0e49\u0e23\u0e49\u0e32\u0e19 \u0e17\u0e38\u0e01\u0e27\u0e31\u0e19 \u0e08-\u0e2a \u0e22\u0e01\u0e40\u0e27\u0e49\u0e19\u0e27\u0e31\u0e19 \u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c",
  //         "number": 1,
  //         "wage": "10,000/\u0e40\u0e14\u0e37\u0e2d\u0e19",
  //         "startDate": "2023-05-02 00:00:00",
  //         "endDate": "2023-04-06 00:00:00",
  //         "closeDate": "2023-01-03 00:00:00",
  //         "workload": " - \u0e22\u0e49\u0e32\u0e22\u0e41\u0e2d\u0e23\u0e4c\n- \u0e25\u0e49\u0e32\u0e07\u0e41\u0e2d\u0e23\u0e4c\n- \u0e0b\u0e48\u0e2d\u0e21\u0e41\u0e2d\u0e23\u0e4c\n- \u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07\u0e41\u0e2d\u0e23\u0e4c",
  //         "qualification": " -  \u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14\u0e27\u0e38\u0e12\u0e34\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32\n- \u0e21\u0e35\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c\n- \u0e40\u0e02\u0e49\u0e32\u0e21\u0e32\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e17\u0e35\u0e48\u0e23\u0e49\u0e32\u0e19\u0e44\u0e14\u0e49\n- \u0e2d\u0e31\u0e18\u0e22\u0e32\u0e28\u0e31\u0e22\u0e14\u0e35 \u0e02\u0e22\u0e31\u0e19 \u0e41\u0e25\u0e30\u0e0b\u0e37\u0e48\u0e2d\u0e2a\u0e31\u0e15\u0e22\u0e4c",
  //         "latitude": 13.781,
  //         "longitude": 100.482
  //       },
  //       {
  //         "owner": "\u0e19\u0e32\u0e22\u0e0a\u0e31\u0e22\u0e22\u0e28 \u0e08\u0e38\u0e15\u0e34\u0e21\u0e32",
  //         "title": "\u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07\u0e44\u0e1f \u0e42\u0e23\u0e07\u0e23\u0e16",
  //         "category": "\u0e07\u0e32\u0e19\u0e0a\u0e48\u0e32\u0e07",
  //         "description": "\u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07\u0e44\u0e1f \u0e40\u0e14\u0e34\u0e19\u0e23\u0e30\u0e1a\u0e1a\u0e44\u0e1f\u0e42\u0e23\u0e07\u0e23\u0e16 \u0e43\u0e2b\u0e49\u0e04\u0e48\u0e32\u0e15\u0e2d\u0e1a\u0e41\u0e17\u0e19\u0e40\u0e21\u0e37\u0e48\u0e2d\u0e07\u0e32\u0e19\u0e40\u0e2a\u0e23\u0e47\u0e08 \u0e40\u0e1a\u0e34\u0e01\u0e04\u0e48\u0e32\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e41\u0e22\u0e01 \u0e44\u0e21\u0e48\u0e2a\u0e39\u0e1a\u0e1a\u0e38\u0e2b\u0e23\u0e35\u0e48\u0e43\u0e19\u0e1a\u0e23\u0e34\u0e40\u0e27\u0e13\u0e07\u0e32\u0e19 \u0e40\u0e1b\u0e47\u0e19\u0e1a\u0e49\u0e32\u0e19\u0e04\u0e19 \u0e40\u0e01\u0e47\u0e1a\u0e07\u0e32\u0e19\u0e43\u0e2b\u0e49\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22\u0e01\u0e48\u0e2d\u0e19\u0e2a\u0e48\u0e07\u0e21\u0e2d\u0e1a \u0e08\u0e1a\u0e07\u0e32\u0e19\u0e44\u0e21\u0e48\u0e40\u0e01\u0e34\u0e19 3 \u0e27\u0e31\u0e19",
  //         "number": 1,
  //         "wage": "1500 \u0e1a\u0e32\u0e17",
  //         "startDate": "2023-02-16 00:00:00",
  //         "endDate": "2023-02-15 00:00:00",
  //         "closeDate": "2023-01-03 00:00:00",
  //         "workload": " - \u0e40\u0e14\u0e34\u0e19\u0e2a\u0e32\u0e22\u0e44\u0e1f\u0e08\u0e32\u0e01\u0e1a\u0e49\u0e32\u0e19\u0e44\u0e1b\u0e42\u0e23\u0e07\u0e23\u0e16\n- \u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07\u0e1a\u0e25\u0e47\u0e2d\u0e01\u0e44\u0e1f 5 \u0e08\u0e38\u0e14\n- \u0e15\u0e34\u0e14\u0e2b\u0e25\u0e2d\u0e14\u0e44\u0e1f 4 \u0e14\u0e27\u0e07",
  //         "qualification": " - \u0e21\u0e35\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c\n- \u0e2a\u0e30\u0e2d\u0e32\u0e14 \n- \u0e17\u0e33\u0e07\u0e32\u0e19\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22\n- \u0e02\u0e22\u0e31\u0e19 \u0e41\u0e25\u0e30\u0e0b\u0e37\u0e48\u0e2d\u0e2a\u0e31\u0e15\u0e22\u0e4c",
  //         "latitude": 13.682,
  //         "longitude": 100.533
  //       },
  //       {
  //         "owner": "\u0e2d\u0e32\u0e13\u0e31\u0e15\u0e34 \u0e08\u0e23\u0e39\u0e0d\u0e2d\u0e38\u0e14\u0e21\u0e2a\u0e38\u0e02",
  //         "title": "\u0e0b\u0e48\u0e2d\u0e21\u0e1d\u0e49\u0e32 \u0e2b\u0e25\u0e31\u0e07\u0e04\u0e32\u0e1a\u0e49\u0e32\u0e19",
  //         "category": "\u0e07\u0e32\u0e19\u0e0a\u0e48\u0e32\u0e07",
  //         "description": "\u0e0b\u0e48\u0e2d\u0e21\u0e1d\u0e49\u0e32 \u0e2b\u0e25\u0e31\u0e07\u0e04\u0e32 \u0e19\u0e49\u0e33\u0e23\u0e31\u0e48\u0e27 4 \u0e08\u0e38\u0e14 \u0e08\u0e48\u0e32\u0e22\u0e40\u0e07\u0e34\u0e19\u0e40\u0e21\u0e37\u0e48\u0e2d\u0e07\u0e32\u0e19\u0e40\u0e2a\u0e23\u0e47\u0e08 \u0e0b\u0e48\u0e2d\u0e21\u0e20\u0e32\u0e22\u0e43\u0e19 1 \u0e27\u0e31\u0e19",
  //         "number": 1,
  //         "wage": "1000 \u0e1a\u0e32\u0e17",
  //         "startDate": "2023-06-16 00:00:00",
  //         "endDate": "2023-12-15 00:00:00",
  //         "closeDate": "2023-03-03 00:00:00",
  //         "workload": " - \u0e2b\u0e32\u0e1b\u0e31\u0e0d\u0e2b\u0e32\u0e19\u0e49\u0e33\u0e23\u0e31\u0e48\u0e27 \u0e41\u0e25\u0e30 \u0e41\u0e01\u0e49\u0e44\u0e02\n- \u0e2d\u0e38\u0e14\u0e23\u0e2d\u0e22\u0e19\u0e49\u0e33\u0e23\u0e31\u0e48\u0e27\u0e17\u0e35\u0e48\u0e1d\u0e49\u0e32 4 \u0e08\u0e38\u0e14\n- \u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1c\u0e48\u0e19\u0e1d\u0e49\u0e32 1 \u0e08\u0e38\u0e14",
  //         "qualification": " - \u0e21\u0e35\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c\n- \u0e2a\u0e30\u0e2d\u0e32\u0e14 \n- \u0e17\u0e33\u0e07\u0e32\u0e19\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22\n- \u0e02\u0e22\u0e31\u0e19 \u0e41\u0e25\u0e30\u0e0b\u0e37\u0e48\u0e2d\u0e2a\u0e31\u0e15\u0e22\u0e4c",
  //         "latitude": 13.872,
  //         "longitude": 100.81
  //       },
  //       {
  //         "owner": "\u0e2d\u0e31\u0e0d\u0e0a\u0e23\u0e34\u0e19\u0e23\u0e4c \u0e2a\u0e23\u0e49\u0e2d\u0e22\u0e19\u0e32\u0e01",
  //         "title": "\u0e2a\u0e48\u0e07\u0e19\u0e49\u0e33\u0e16\u0e31\u0e07 \u0e15\u0e32\u0e21\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19",
  //         "category": "\u0e02\u0e19\u0e2a\u0e48\u0e07",
  //         "description": "\u0e02\u0e31\u0e1a\u0e23\u0e16\u0e2a\u0e48\u0e07\u0e19\u0e49\u0e33\u0e16\u0e31\u0e07 \u0e15\u0e32\u0e21\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19 \u0e21\u0e35\u0e23\u0e16\u0e43\u0e2b\u0e49\u0e43\u0e0a\u0e49 \u0e40\u0e1a\u0e34\u0e01\u0e04\u0e48\u0e32\u0e19\u0e49\u0e33\u0e21\u0e31\u0e19\u0e44\u0e14\u0e49",
  //         "number": 2,
  //         "wage": "9,000/\u0e40\u0e14\u0e37\u0e2d\u0e19",
  //         "startDate": "2023-04-23 00:00:00",
  //         "endDate": "2023-10-23 00:00:00",
  //         "closeDate": "2023-01-03 00:00:00",
  //         "workload": " - \u0e02\u0e31\u0e1a\u0e23\u0e16\u0e2a\u0e48\u0e07\u0e19\u0e49\u0e33\u0e16\u0e31\u0e07\n- \u0e22\u0e01\u0e43\u0e2b\u0e49\u0e25\u0e39\u0e01\u0e04\u0e49\u0e32\n- \u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a\u0e2a\u0e20\u0e32\u0e1e\u0e16\u0e31\u0e07\n- \u0e04\u0e34\u0e14\u0e40\u0e07\u0e34\u0e19",
  //         "qualification": " -  \u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14\u0e27\u0e38\u0e12\u0e34\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32\n- \u0e44\u0e21\u0e48\u0e08\u0e33\u0e40\u0e1b\u0e47\u0e19\u0e15\u0e49\u0e2d\u0e07\u0e21\u0e35\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c\n- \u0e21\u0e35\u0e43\u0e1a\u0e02\u0e31\u0e1a\u0e02\u0e35\u0e48\n- \u0e02\u0e31\u0e1a\u0e23\u0e16\u0e22\u0e19\u0e15\u0e4c\u0e44\u0e14\u0e49 (\u0e40\u0e01\u0e35\u0e22\u0e23\u0e4c\u0e01\u0e23\u0e30\u0e1b\u0e38\u0e01)",
  //         "latitude": 13.672,
  //         "longitude": 100.616
  //       },
  //       {
  //         "owner": "\u0e2d\u0e18\u0e34\u0e1b \u0e2a\u0e39\u0e0d\u0e2a\u0e34\u0e49\u0e19\u0e20\u0e31\u0e22",
  //         "title": "\u0e1e\u0e19\u0e31\u0e01\u0e07\u0e32\u0e19\u0e02\u0e19\u0e02\u0e2d\u0e07 \u0e22\u0e49\u0e32\u0e22\u0e1a\u0e49\u0e32\u0e19",
  //         "category": "\u0e02\u0e19\u0e2a\u0e48\u0e07",
  //         "description": "\u0e02\u0e19\u0e02\u0e2d\u0e07\u0e22\u0e49\u0e32\u0e22\u0e1a\u0e49\u0e32\u0e19 \u0e0a\u0e48\u0e27\u0e22\u0e22\u0e01\u0e44\u0e14\u0e49",
  //         "number": 1,
  //         "wage": "400/\u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07",
  //         "startDate": "2023-04-18 00:00:00",
  //         "endDate": "2023-09-15 00:00:00",
  //         "closeDate": "2023-03-03 00:00:00",
  //         "workload": " - \u0e02\u0e19\u0e02\u0e2d\u0e07\u0e22\u0e49\u0e32\u0e22\u0e1a\u0e49\u0e32\u0e19 \u0e23\u0e30\u0e22\u0e30\u0e17\u0e32\u0e07 10 \u0e01\u0e21.\n- \u0e0a\u0e48\u0e27\u0e22\u0e22\u0e01\u0e02\u0e36\u0e49\u0e19 \u0e41\u0e25\u0e30 \u0e25\u0e07",
  //         "qualification": " - \u0e14\u0e39\u0e41\u0e25\u0e02\u0e2d\u0e07\u0e44\u0e14\u0e49 \u0e44\u0e21\u0e48\u0e42\u0e22\u0e19\n- \u0e21\u0e35\u0e23\u0e16\u0e21\u0e32\u0e40\u0e2d\u0e07",
  //         "latitude": 13.743,
  //         "longitude": 100.56
  //       },
  //       {
  //         "owner": "\u0e20\u0e31\u0e17\u0e23\u0e18\u0e34\u0e23\u0e32 \u0e21\u0e35\u0e40\u0e28\u0e23\u0e29\u0e10\u0e35",
  //         "title": "\u0e15\u0e31\u0e14\u0e2b\u0e0d\u0e49\u0e32 \u0e23\u0e2d\u0e1a\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19",
  //         "category": "\u0e23\u0e31\u0e1a\u0e08\u0e49\u0e32\u0e07",
  //         "description": "\u0e15\u0e31\u0e14\u0e2b\u0e0d\u0e49\u0e32\u0e23\u0e2d\u0e1a\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19 \u0e17\u0e33\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c \u0e43\u0e2b\u0e49\u0e04\u0e48\u0e32\u0e15\u0e2d\u0e1a\u0e41\u0e17\u0e19\u0e23\u0e32\u0e22\u0e04\u0e23\u0e31\u0e49\u0e07 \u0e21\u0e35\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e43\u0e2b\u0e49",
  //         "number": 1,
  //         "wage": "500/\u0e27\u0e31\u0e19",
  //         "startDate": "2023-05-02 00:00:00",
  //         "endDate": "2023-04-06 00:00:00",
  //         "closeDate": "2023-01-03 00:00:00",
  //         "workload": " - \u0e15\u0e31\u0e14\u0e2b\u0e0d\u0e49\u0e32\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e2a\u0e48\u0e27\u0e19\u0e01\u0e25\u0e32\u0e07\u0e43\u0e19\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19\n- \u0e17\u0e33\u0e07\u0e32\u0e19\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c",
  //         "qualification": " - \u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14\u0e40\u0e1e\u0e28\n- \u0e17\u0e33\u0e07\u0e32\u0e19\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22 \u0e02\u0e22\u0e31\u0e19",
  //         "latitude": 13.821,
  //         "longitude": 100.677
  //       },
  //       {
  //         "owner": "\u0e2d\u0e32\u0e13\u0e31\u0e15\u0e34 \u0e08\u0e23\u0e39\u0e0d\u0e2d\u0e38\u0e14\u0e21\u0e2a\u0e38\u0e02",
  //         "title": "\u0e04\u0e19\u0e14\u0e39\u0e41\u0e25\u0e2b\u0e2d\u0e1e\u0e31\u0e01",
  //         "category": "\u0e23\u0e31\u0e1a\u0e08\u0e49\u0e32\u0e07",
  //         "description": "\u0e14\u0e39\u0e41\u0e25\u0e2b\u0e2d\u0e1e\u0e31\u0e01 \u0e19\u0e31\u0e01\u0e28\u0e36\u0e01\u0e29\u0e32 \u0e21\u0e35\u0e17\u0e35\u0e48\u0e1e\u0e31\u0e01\u0e43\u0e2b\u0e49 \u0e21\u0e32\u0e2d\u0e22\u0e39\u0e48\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19",
  //         "number": 1,
  //         "wage": "10,000/\u0e40\u0e14\u0e37\u0e2d\u0e19",
  //         "startDate": "2023-04-23 00:00:00",
  //         "endDate": "2023-10-23 00:00:00",
  //         "closeDate": "2023-01-03 00:00:00",
  //         "workload": " - \u0e14\u0e39\u0e41\u0e25\u0e04\u0e27\u0e32\u0e21\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22\u0e43\u0e19\u0e1a\u0e23\u0e34\u0e40\u0e27\u0e13\n- \u0e14\u0e39\u0e41\u0e25\u0e1c\u0e39\u0e49\u0e1e\u0e31\u0e01\u0e2d\u0e32\u0e28\u0e31\u0e22\u0e2b\u0e32\u0e01\u0e21\u0e35\u0e1b\u0e31\u0e0d\u0e2b\u0e32\n- \u0e40\u0e0a\u0e47\u0e04\u0e04\u0e48\u0e32\u0e19\u0e49\u0e33 \u0e04\u0e48\u0e32\u0e44\u0e1f \u0e17\u0e38\u0e01\u0e40\u0e14\u0e37\u0e2d\u0e19\n- \u0e23\u0e32\u0e22\u0e07\u0e32\u0e19\u0e40\u0e08\u0e49\u0e32\u0e02\u0e2d\u0e07\u0e17\u0e38\u0e01\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c",
  //         "qualification": " - \u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14\u0e40\u0e1e\u0e28\n-  \u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14\u0e27\u0e38\u0e12\u0e34\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32\n- \u0e21\u0e32\u0e2d\u0e22\u0e39\u0e48\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e44\u0e14\u0e49\n- \u0e43\u0e0a\u0e49\u0e04\u0e2d\u0e21\u0e1e\u0e34\u0e27\u0e40\u0e15\u0e2d\u0e23\u0e4c\u0e40\u0e1b\u0e47\u0e19",
  //         "latitude": 13.687,
  //         "longitude": 100.656
  //       },
  //       {
  //         "owner": "\u0e20\u0e31\u0e17\u0e23\u0e18\u0e34\u0e23\u0e32 \u0e21\u0e35\u0e40\u0e28\u0e23\u0e29\u0e10\u0e35",
  //         "title": "\u0e08\u0e31\u0e14\u0e2a\u0e27\u0e19\u0e43\u0e19\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19",
  //         "category": "\u0e23\u0e31\u0e1a\u0e08\u0e49\u0e32\u0e07",
  //         "description": "\u0e14\u0e39\u0e41\u0e25\u0e2a\u0e27\u0e19\u0e43\u0e19\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e2a\u0e48\u0e27\u0e19\u0e01\u0e25\u0e32\u0e07\u0e02\u0e2d\u0e07\u0e2b\u0e21\u0e39\u0e48\u0e1a\u0e49\u0e32\u0e19 \u0e21\u0e35\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e43\u0e2b\u0e49",
  //         "number": 1,
  //         "wage": "9000/\u0e40\u0e14\u0e37\u0e2d\u0e19",
  //         "startDate": "2023-04-23 00:00:00",
  //         "endDate": "2023-10-23 00:00:00",
  //         "closeDate": "2023-01-03 00:00:00",
  //         "workload": " - \u0e14\u0e39\u0e41\u0e25\u0e2a\u0e27\u0e19\n- \u0e23\u0e14\u0e19\u0e49\u0e33 \u0e43\u0e2a\u0e48\u0e1b\u0e38\u0e4b\u0e22\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19\n- \u0e15\u0e31\u0e14\u0e41\u0e15\u0e48\u0e07\u0e01\u0e34\u0e48\u0e07\n- \u0e01\u0e27\u0e32\u0e14\u0e43\u0e1a\u0e44\u0e21\u0e49",
  //         "qualification": " - \u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14\u0e40\u0e1e\u0e28\n-  \u0e44\u0e21\u0e48\u0e08\u0e33\u0e01\u0e31\u0e14\u0e27\u0e38\u0e12\u0e34\u0e01\u0e32\u0e23\u0e28\u0e36\u0e01\u0e29\u0e32\n- \u0e17\u0e33\u0e07\u0e32\u0e19\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22\n- \u0e02\u0e22\u0e31\u0e19 \u0e41\u0e25\u0e30\u0e0b\u0e37\u0e48\u0e2d\u0e2a\u0e31\u0e15\u0e22\u0e4c\n- \u0e21\u0e35\u0e04\u0e27\u0e32\u0e21\u0e23\u0e39\u0e49\u0e40\u0e01\u0e35\u0e48\u0e22\u0e27\u0e01\u0e31\u0e1a\u0e15\u0e49\u0e19\u0e44\u0e21\u0e49\n- \u0e21\u0e35\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c",
  //         "latitude": 13.808,
  //         "longitude": 100.65
  //       }
  //     ]

  //     for (const jobPost of jobPosts) {
  //       const job: any = {

  //         ...jobPost
  //       }
  //       const owner : string = job['owner']
  //       const user = await this.usersService.getUserByName(owner.trim())
  //       const category = await this.jobPostsService.getJobCategoryByName(job['category'])

  //       job['location'] = {
  //         'latitude': job['latitude'],
  //         'longitude': job['longitude']
  //       }
  //       delete job['owner']
  //       delete job['latitude']
  //       delete job['longitude']
  //       delete job['category']
  //       //@ts-ignore
  //       // job.startDate = new Date(job.startDate)
  //       // //@ts-ignore
  //       // job.endDate = new Date(job.endDate)
  //       //@ts-ignore
  //       job.category = category._id
  //       // user.birthDate = new Date(user.birthDate)
  //       await this.jobPostsService.create(user, job)
  //     }
  //   }

  @Command({ command: 'migrate:job_posts', describe: 'migrate job posts' })
  async migrate() {
    const _data = await fs.readFile('./backup/job_posts.json', 'utf-8');
    const jobPosts: LegacyJobPost[] = JSON.parse(_data);
    const _data2 = await fs.readFile('./backup/users.json', 'utf-8');
    const users: User[] = JSON.parse(_data2);
    const mapOidToLineId = (userId: string) => {
      for (const user of users) {
        if (userId === user._id.$oid) {
          return user.lineId;
        }
      }
      return '';
    };
    const districts = await this.districtsService.getDistricts({
      provinceId: 10,
    });

    for (const jobPost of jobPosts) {
      const user: UserDocument = await this.usersService.getUserByLineId(
        mapOidToLineId(jobPost.createdBy.$oid),
      );
      const p: CreatePendingJobPostsDto = {
        title: jobPost.title,
        category: jobPost.category.$oid as any,
        description: jobPost.description,
        applicants: {
          number: jobPost.applicants.number,
        },
        wage: {
          amount: jobPost.wage.amount,
          unit: jobPost.wage.unit,
        },
        startDate: new Date(jobPost.startDate.$date),
        endDate: new Date(jobPost.endDate.$date),
        closeDate: new Date(jobPost.closeDate.$date),
        workload: jobPost.workload,
        qualification: jobPost.qualification,
        // images: [],
        location: {
          address: {
            name: 'address',
            district:
              districts[
                Math.floor(Math.random() * districts.length)
              ]._id.toString(),
          },
          longitude: parseFloat(jobPost.location.longitude),
          latitude: parseFloat(jobPost.location.latitude),
        },
      };

      const createdP = await this.pendingJobPostsService.create(user, p, []);

      const reviewedUser = await this.usersService.getUserByLineId(
        'q9CjqoWOTF',
      );
      await this.pendingJobPostsService.approve(
        reviewedUser,
        createdP._id.toString(),
      );
      console.log('migrate job post successfully');
    }
  }
}
