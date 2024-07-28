import { TopicData } from '@/lib/interfaces';
import {atom} from 'recoil';


export const topicState = atom<TopicData[] | []>({
    key:'topicState',
    default:[],
})