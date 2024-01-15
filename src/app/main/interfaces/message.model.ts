import { Timestamp } from '@angular/fire/firestore';


type MessageContent = string | { type: 'image' | 'audio' | 'voiceNote'; data: string };

export interface IMessage {
  senderId: string;
  receiverId: string;
  content: MessageContent;
  timestamp: Timestamp;
}

export interface IGetMessages extends IMessage{ 
  id: string;
}