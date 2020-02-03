import { Telegraf } from 'telegraf';
import giveSocksEasterEgg from './givesocks.easteregg';
import attackEasterEgg from './attack.easteregg';
import isThisRealEasterEgg from './isthisreal.easteregg';
import haveIGoneMadEasterEgg from './haveigonemad.easteregg';

export default function registerEasterEggs(bot: Telegraf<any>) {
    giveSocksEasterEgg(bot);
    attackEasterEgg(bot);
    isThisRealEasterEgg(bot);
    haveIGoneMadEasterEgg(bot);
}