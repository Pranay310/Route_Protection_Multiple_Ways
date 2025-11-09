import { SetMetadata } from '@nestjs/common';

export const ABAC_ACTION_KEY = 'abac_action';

// Example: @AbacAction('update')
export const AbacAction = (action: string) =>
  SetMetadata(ABAC_ACTION_KEY, action);
