import { ssmCredentials } from 'lib/util/ssm';
import axios from 'axios';

const {NASA_API_KEY} = await ssmCredentials(["NASA_API_KEY"]);

/**
 * fetches Astronomy picture of the day from NASA's servers
 */
export const space =  async (): Promise<{type: number, data: any}> => {
    console.info('fetching space pic');

    const response: {data: {url: string, title: string, explanation: string}} = 
      await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)

    console.debug(response.data.url);

    return { type: 4, data: {
      content: response.data.explanation,
      tts: "false",
      embeds: [
        {
          type: "rich",
          title: response.data.title,
          color: 0x00FFFF,
          image: {
            url: response.data.url,
            height: 0,
            width: 0
          }
        }
      ],
    }};
}