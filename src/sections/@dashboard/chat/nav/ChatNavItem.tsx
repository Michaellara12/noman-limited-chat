import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import {
  Stack,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
} from '@mui/material';
// @types
import { ILeadProfile } from '../../../../@types/chat';
// components
import { CustomAvatar } from '../../../../components/custom-avatar';
import BadgeStatus from '../../../../components/badge-status';
//
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  lead: ILeadProfile;
  openNav: boolean;
  // isSelected: boolean;
};

export default function ChatNavItem({ lead, openNav }: Props) {

  const lastActivity = lead.lastActivity;

  const isUnread = lead.unreadCount > 0;

  const { push, query: { conversationKey, chatroomId }} = useRouter();

  const isSelected = conversationKey === lead.id;

  function handleClick(conversationId: string) {
    push(PATH_DASHBOARD.chat.viewChat(chatroomId as string, conversationId))
  }

  return (
    <ListItemButton
      disableGutters
      onClick={() => handleClick(lead.id)}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(isSelected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>

            <CustomAvatar
                key={lead.id}
                alt={lead.name}
                src={lead.profilePic}
                sx={{ width: 48, height: 48 }}
            />
      
      </ListItemAvatar>

      {openNav && (
        <>
          <ListItemText
              primary={lead.name}
              primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
              secondary={lead.lastMessage}
              secondaryTypographyProps={{
                noWrap: true,
                variant: isUnread ? 'subtitle2' : 'body2',
                color: isUnread ? 'text.primary' : 'text.secondary',
            }}
          />

          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
              }}
          >
              {formatDistanceToNowStrict(new Date(lastActivity.toDate().getTime()), {
                addSuffix: false,
              })}
            </Typography>

            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Stack>
        </>
      )}
      
    </ListItemButton>
  );
}
