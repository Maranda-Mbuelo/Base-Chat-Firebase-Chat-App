import { Timestamp } from '@firebase/firestore-types';

type MessageContent = string | { type: 'image' | 'audio' | 'voiceNote'; data: string };

export interface IMessage {
  senderId: string;
  receiverId: string;
  content: MessageContent;
  timestamp: Date;
}