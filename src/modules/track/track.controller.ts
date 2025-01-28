import { Controller, Get, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import ArtistsSummarySortType from '../../models/artistsSummarySortType';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get('/summary')
  async getSummary(@Query('sort') sort: string) {
    const totalUserTracks = await this.trackService.getAllUserTracks();

    const artistsSummary = this.trackService.getArtistsSummary(totalUserTracks);

    if (!sort || sort === '' || !(sort in ArtistsSummarySortType)) {
      return this.trackService.orderArtistsSummary(artistsSummary);
    }

    return this.trackService.orderArtistsSummary(
      artistsSummary,
      sort as ArtistsSummarySortType,
    );
  }
}
