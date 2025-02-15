import { Controller, Get, Query } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get('/summary')
  async getSummary(@Query('sort') sort: string) {
    return this.trackService.getArtistsSummaryBySort(sort);
  }
}
