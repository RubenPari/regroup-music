import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import SpotifyApi from 'spotify-web-api-node';
import ArtistSummary from '../../models/artistSummary';

@Controller('track')
export class TrackController {
  @Get('/summary')
  async getSummary(@Req() req: Request) {
    const spotifyApi = req.spotifyApi as SpotifyApi;

    // get all user tracks
    const limit = 50;
    let offset = 0;
    let totalUserTracks: Array<SpotifyApi.SavedTrackObject> = [];

    for (let i = 0; i < limit; i++) {
      const tracksPage = await spotifyApi.getMySavedTracks({ limit, offset });

      if (tracksPage.body.items.length === 0) {
        break;
      }

      totalUserTracks = totalUserTracks.concat(tracksPage.body.items);

      offset += limit;
    }

    // create an array of objects where each object has the artist name, artist id, track number of them
    const arrayArtistSummary = totalUserTracks.reduce<ArtistSummary[]>(
      (acc, track) => {
        const mainArtist = track.track.artists[0];

        if (!acc[mainArtist.id]) {
          acc[mainArtist.id] = {
            name: mainArtist.name,
            id: mainArtist.id,
            count: 1,
          };
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          acc[mainArtist.id].count++;
        }

        return acc;
      },
      {} as ArtistSummary[],
    );

    // reordering objects array from most counted to least counted
    return Object.values(arrayArtistSummary).sort((a, b) => b.count - a.count);
  }
}
