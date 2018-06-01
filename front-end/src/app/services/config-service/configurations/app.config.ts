import { localhost } from './clients/localhost.config';
import { kta } from './clients/kta.config';
import { IHostConfig } from '../config.model';
import { swm } from './clients/swm.config';
import { tbs } from './clients/tbs.config';
import { icdlb } from './clients/icdlb.config';
import { gogoviet } from './clients/gogoviet.config';
import { ktg } from './clients/ktg.config';

export const host: IHostConfig = {
    "localhost": localhost,
    "swm.gogoviet.com": gogoviet,
    "kta.smartlog.info": kta,
    "swm.smartlog.info": swm,
    "tbs.smartlog.info": tbs,
    "icdlb.smartlog.info": icdlb,
    "ktg.smartlog.info": ktg,
};