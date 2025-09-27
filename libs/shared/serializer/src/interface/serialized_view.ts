import { ClassSerializerContextOptions } from '@nestjs/common';

export abstract class SerializedView {
  static serializerOptions: ClassSerializerContextOptions;
}
