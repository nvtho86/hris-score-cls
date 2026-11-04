import { Int32 } from "typeorm";

export interface CoursePayload {

  about: string;
  code: string;
  formOfStudy: boolean;
  name: string;
  tag: string;
  thumbnail: string;
  topicId: string;
  videoUrl: string;
  credit: string;



}
