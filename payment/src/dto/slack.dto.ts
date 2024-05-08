import { Static, Type } from '@sinclair/typebox';

export const slackEventDTO = Type.Object({
  token: Type.String(),
  team_id: Type.String(),
  team_domain: Type.String(),
  channel_id: Type.String(),
  channel_name: Type.String(),
  user_id: Type.String(),
  user_name: Type.String(),
  command: Type.String(),
  text: Type.String(),
  api_app_id: Type.String(),
  is_enterprise_install: Type.String(),
  response_url: Type.String(),
  trigger_id: Type.String(),
});

export type SlackEvent = Static<typeof slackEventDTO>;
