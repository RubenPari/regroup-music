import { Injectable } from '@nestjs/common';
import ArtistSummary from '../../models/artistSummary';
import ArtistsSummarySortType from '../../models/artistsSummarySortType';
import { SpotifyService } from '../spotify/spotify.service';

@Injectable()
export class TrackService {
  constructor(private readonly spotifyService: SpotifyService) { }
}
