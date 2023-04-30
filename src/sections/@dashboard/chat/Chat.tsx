// next
import { useRouter } from 'next/router';
// @mui
import { Card, Container, Box, Typography, Stack } from '@mui/material';
// components
import { useSettingsContext } from '../../../components/settings';
import ChatNavSidebar from './nav/ChatNavSidebar';
import ChatBody from './room/ChatBody';

// ----------------------------------------------------------------------

export default function Chat() {

  const { themeStretch } = useSettingsContext();

  const { query: { conversationKey } } = useRouter();

  const detailView = !!conversationKey;

  return (
    <Container maxWidth={themeStretch ? false : 'xl'} sx={{ position: {xs: 'fixed', md: 'fixed', lg: 'static'} }}>
      <Card sx={{ height: '80vh', display: 'flex' }}>
        <>
          <ChatNavSidebar />
                  
            {detailView
              ?
                <ChatBody />
              :
                <Stack direction='column' spacing={2} alignItems='center' justifyContent='center' sx={{width: '100%'}} >
                  <Box sx={{width: {md: '50%'}, display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
                    <img src="/assets/illustrations/robot-phone.png"/>
                  </Box>
                  <Typography variant='h4' align='center' sx={{mx: 3}}>Selecciona una conversación 📱💬</Typography>
                </Stack>
            }
        </>

      </Card>
    </Container>
  );
}