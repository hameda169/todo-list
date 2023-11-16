import pino from 'pino';
import { createPinoBrowserSend, createWriteStream } from 'pino-logflare';

const logFlareOptions = {
  apiKey: process.env.LOG_FLARE_API_KEY!,
  sourceToken: process.env.LOG_FLARE_SOURCE_TOKEN!,
};

const stream = createWriteStream(logFlareOptions);
const send = createPinoBrowserSend(logFlareOptions);

const logger = pino({ browser: { transmit: { send: send } } }, stream);

export default logger;
