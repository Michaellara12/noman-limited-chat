import { useState, useEffect } from 'react';
// mui
import { styled, Button, Dialog, DialogTitle, DialogContent, IconButton, Typography, CircularProgress, Box, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// utils
import { hideScrollbarY } from 'src/utils/cssStyles';
//
import QRCode from "react-qr-code";

// ----------------------------------------------------------------------

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type ScanQRCodeProps = {
  open: boolean;
  handleClose: () => void;
}

export default function ScanQRCodeDialog({ open, handleClose }: ScanQRCodeProps) {

  const [downloadingData, setDownloadingData] = useState(false);

  const [downloadMessagesStep, setDownloadMessagesStep] = useState(false);

  const [loadingQRCode, setDownloadingQRCode] = useState(true)

  const [importMessages, setImportMessages] = useState(false)

  const [qrcode, setQRCode] = useState('');

  const handleDoNotImportChats = () => {
    setDownloadMessagesStep(true)
  }

  const handleImportChats = () => {
    setImportMessages(true)
    setDownloadMessagesStep(true)
  }

  const DownloadMessagesSelectionScreen = () => {
    return (
  
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: {xs: 'column', md: 'row'} }}>
        <Box >
          <img src='/assets/illustrations/phone-messages.png' />
        </Box>
        <Stack spacing={2} sx={{ width: {lg: '40%', md: '70%'}, py: 2 }} >
          <Typography variant='h3' align='center'>Importar las últimas 25 conversaciones</Typography>
          <Typography variant='body2' align='center'>Importar últimas conversaciones además de los últimos 30 mensajes de cada conversación que hayas tenido en esta cuenta de WhatsApp</Typography>
          <Button variant='contained' sx={{ width: '100%' }} onClick={handleImportChats} >Importar chats</Button>
          <Button variant='outlined' sx={{ width: '100%' }} onClick={handleDoNotImportChats} >No importar chats</Button>
        </Stack>
        
      </Box>
    )
  }

  const QRCodeScreen = () => {

    const fetcher = async (url: string) => {
      const res = await fetch(url)
      const data = await res.json()
    
      if (res.status !== 200) {
        throw new Error(data.message)
      }
      console.log('res: ', res)
      console.log('data: ', data)
      return data
    }

    // if (error) return <div>{error.message}</div>
    // if (data?.res === 'loading') {
    //   setDownloadingData(true)
    // }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: {xs: 'column', md: 'column', lg:'row'} }} >
         <Stack alignItems='center' justifyContent='center' >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src='https://entey.net/wp-content/uploads/2023/03/descarga-12-4.png'/>
              </Box>
            </Box>
  
            <Stack alignItems='center' >
              <Typography variant='h3' align='center' sx={{ pt: 2 }} >Lee las instrucciones 👇</Typography>
              <Typography variant='body1' align='center' sx={{ px: 4, mb: 2 }} >{`El escáner de WhatsApp está en las opciones de tú cuenta de WhatsApp. Encuéntralo, en Menú ⋮ > Dispositivos vinculados > Vincular un dispositivo.`}</Typography>
              <Button variant='outlined' onClick={() => setDownloadMessagesStep(false)} >Regresar</Button>
            </Stack>
          </Stack>
  
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: 300, py: 2 }} >
              <img src='/assets/illustrations/scanQR.gif' />
            </Box>
          </Box>
      </Box>
    )
  }

  const LoadingScreen = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant='h4' sx={{ mt: 3 }} >Configurando cuenta, esto puede tardar algunos minutos...</Typography>
        <img  src='/assets/illustrations/construction.png' />
      </Box>
    )
  }

  return (
    <div>
      <BootstrapDialog
        onClose={!downloadingData ? handleClose : undefined}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth='lg'
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {!downloadingData ? (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent sx={{ ...hideScrollbarY }} >
          {downloadMessagesStep
            ?
              downloadingData
                ?
                  <LoadingScreen />
                :
                  <QRCodeScreen />
            :
              <DownloadMessagesSelectionScreen />
          }
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}