import { Timestamp } from '@angular/fire/firestore';

export interface IUpperLinks{
    route: string;
    icon: string;
    name: string;
}

export interface IBottomLinks extends IUpperLinks{}


export interface IPost{
    title?: string;
    id: string;
    content: string;
    timestamp: Timestamp;
    likes: number;
}

export interface IMediaPost extends IPost{
    images: Array<string>;
}

export interface IMiniUser{
    username: string;
    image?: string;
    id: string;
}

export interface IPostWithUser {
    id: string;
    post: IPost | IMediaPost;
    user: IMiniUser;
}

