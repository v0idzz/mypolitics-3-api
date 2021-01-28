import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ErrorsMessages } from '../../constants';
import { ErrorCode } from '../../types';

@Injectable()
export class RespondentGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext();
    if (!req.respondent) {
      throw new UnauthorizedException(ErrorsMessages[ErrorCode.RESPONDENT_HEADER_NOT_PROVIDED]);
    }

    return true;
  }
}
