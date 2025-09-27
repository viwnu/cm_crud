import { applyDecorators, ClassSerializerInterceptor, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { SerializedView } from './interface';

export function SerializeView(serializedView: typeof SerializedView) {
  return applyDecorators(UseInterceptors(ClassSerializerInterceptor), SerializeOptions(serializedView.serializerOptions));
}
