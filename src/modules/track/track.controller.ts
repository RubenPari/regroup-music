import { Controller, Get, Query } from '@nestjs/common';
import { TrackService } from './track.service';
import ArtistsSummarySortType from '../../models/artistsSummarySortType';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get('/summary')
  async getSummary(@Query('sort') sort: string) {
    const totalUserTracks = await this.trackService.getAllUserTracks();

    const arrayArtistSummary =
      this.trackService.getArtistsSummary(totalUserTracks);

    if (!sort || sort === '' || !(sort in ArtistsSummarySortType)) {
      return this.trackService.orderArtistsSummary(arrayArtistSummary);
    }

    return this.trackService.orderArtistsSummary(
      arrayArtistSummary,
      sort as ArtistsSummarySortType,
    );
  }
}
