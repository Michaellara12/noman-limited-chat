// @mui
import { Avatar, Divider, Collapse, Typography, Stack } from '@mui/material';
// @types
import { ILeadProfile } from '../../../../@types/chat';
// components
import Iconify from '../../../../components/iconify';
//
import ChatRoomCollapseButton from './ChatRoomCollapseButton';

// ----------------------------------------------------------------------

type Props = {
  lead: ILeadProfile;
  isCollapse: boolean;
  onCollapse: VoidFunction;
};

export default function ChatRoomSingle({ lead, isCollapse, onCollapse }: Props) {
  if (!lead) {
    return null;
  }

  return (
    <div>
      <Stack alignItems="center" sx={{ py: 4 }}>
        <Avatar
          alt={lead.name}
          src={lead.profilePic}
          sx={{ width: 96, height: 96, mb: 2 }}
        />

        <Typography variant="subtitle1">{lead.name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {lead.phone}
        </Typography>
      </Stack>

      <Divider />

      <ChatRoomCollapseButton isCollapse={isCollapse} onCollapse={onCollapse}>
        información
      </ChatRoomCollapseButton>

      <Collapse in={isCollapse}>
        <Stack
          spacing={2}
          sx={{
            p: (theme) => theme.spacing(2, 2.5, 2.5, 2.5),
          }}
        >
          {[
            { icon: 'eva:phone-fill', value: lead.phone },
            { icon: 'eva:email-fill', value: lead.email },
          ].map((row, index) => (
            <Stack key={row.icon} direction="row">
              <Iconify
                icon={row.icon}
                sx={{
                  mr: 1,
                  mt: 0.5,
                  flexShrink: 0,
                  color: 'text.disabled',
                }}
              />
              <Typography variant="body2" noWrap={index === 2}>
                {row.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </div>
  );
}
