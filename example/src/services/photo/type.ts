import { SuccessResponse } from '../../network/type';

export declare module PhotoServiceTypes {
  export interface Comments {
    _content: number;
  }

  export interface Dates {
    posted: string;
    taken: string;
    takengranularity: number;
    takenunknown: number;
    lastupdate: string;
  }

  export interface Editability {
    cancomment: number;
    canaddmeta: number;
  }

  export interface Gift {
    gift_eligible: string;
    eligible_durations: string[];
    new_flow: string;
  }

  export interface Notes {
    note: any[];
  }

  export interface Owner {
    nsid: string;
    username: string;
    realname: string;
    location: string;
    iconserver: string;
    iconfarm: number;
    path_alias: string;
    gift: Gift;
  }

  export interface People {
    haspeople: number;
  }

  export interface Photo {
    id: string;
    owner: string;
    secret: string;
    server: string;
    farm: number;
    title: string;
    ispublic: number;
    isfriend: number;
    isfamily: number;
  }

  export interface PhotoDetail {
    id: string;
    secret: string;
    server: string;
    farm: number;
    dateuploaded: string;
    isfavorite: number;
    license: number;
    safety_level: number;
    rotation: number;
    originalsecret: string;
    originalformat: string;
    owner: Owner;
    title: TextContent;
    description: TextContent;
    visibility: Visibility;
    dates: Dates;
    views: number;
    editability: Editability;
    publiceditability: Editability;
    usage: Usage;
    comments: Comments;
    notes: Notes;
    people: People;
    tags: Tags;
    urls: Urls;
    media: string;
  }

  export interface PhotoResponseData extends SuccessResponse {
    photo: PhotoDetail;
  }

  export interface Photos {
    page: number;
    pages: number;
    perpage: number;
    total: number;
    photo: Photo[];
  }

  export interface PhotosResponseData extends SuccessResponse {
    photos: Photos;
  }

  export interface Tag extends TextContent {
    id: string;
    author: string;
    authorname: string;
    raw: string;
    machine_tag: any;
  }

  export interface Tags {
    tag: Tag[];
  }

  export interface TextContent {
    _content: string;
  }

  export interface Url extends TextContent {
    type: string;
  }

  export interface Urls {
    url: Url[];
  }

  export interface Usage {
    candownload: number;
    canblog: number;
    canprint: number;
    canshare: number;
  }

  export interface Visibility {
    ispublic: number;
    isfriend: number;
    isfamily: number;
  }
}
