import { Typography, Stack, Button } from "@mui/material"
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function DrawerFooter() {

  return (
    <Stack spacing={2}>
        <Typography variant='subtitle1' align='center'>
            ¿Deseas reportar algún error o tienes sugerencias?
        </Typography>
        <Typography variant='body2' align='center'>
            Chatea con uno de nuestros desarrolladores
        </Typography>
        <img src='/assets/illustrations/settings.png' alt='robot' />
        <Button
            variant='contained' 
            sx={{py: 1}}  
            startIcon={<WhatsAppIcon />} 
            href='https://wa.link/u20j9g'
            target='_blank'
        >
            Escríbenos
        </Button>
    </Stack>
  )
}

export default DrawerFooter