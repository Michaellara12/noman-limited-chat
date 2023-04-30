// @mui
import { Stack, Button, Typography, Box } from '@mui/material';
// icon
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// locales
import { useLocales } from '../../../locales';

// ----------------------------------------------------------------------

export default function NavDocs() {

  const { translate } = useLocales();

  return (
    <Stack
      spacing={3}
      sx={{
        px: 3,
        pb: 5,
        mt: 2,
        width: 1,
        display: 'block',
        textAlign: 'center',
      }}
    >

      <div>
        <Typography gutterBottom variant="subtitle1">
          {`${translate('¿Deseas más funcionalidades?')}`}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {`${translate('Nuestros precios se ajustan a cualquier presupuesto')}`}
        </Typography>
      </div>

      <Box component="img" src="/assets/illustrations/call-center.png" />

      <Button startIcon={<ShoppingCartIcon/>} variant="contained" sx={{width: '100%', py: 1 }} href='https://content.entey.net/precios/' target='_blank'>{`${translate('Adquiere Noman Pro')}`}</Button>
    </Stack>
  );
}
