// @mui
import { Typography, Stack, Box } from '@mui/material';
// components
import { m } from 'framer-motion';
import { MotionContainer, varBounce } from 'src/components/animate';
import Image from '../../components/image';
import Logo from '../../components/logo';
import NomanLogo from 'src/components/logo/NomanLogo';
// styles
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  illustration?: string;
  children: React.ReactNode;
  subtitle?: string;
};

export default function LoginLayout({ children, illustration, title, subtitle }: Props) {
  return (
    <StyledRoot>
      <Box
        sx={{
          zIndex: 9,
          position: 'absolute',
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
        }}
      >
        <NomanLogo />
      </Box>

      <StyledSection>
        <Typography variant="h3" sx={{ mb: 2, maxWidth: 480, textAlign: 'center' }}>
          {title || '¡Hola!, que bueno verte de vuelta por aquí'}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, maxWidth: 480, textAlign: 'center' }}>
          {subtitle}
        </Typography>
        
        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Image
              disabledEffect
              visibleByDefault
              alt="auth"
              src={illustration || '/assets/illustrations/chatroom2.png'}
              sx={{ maxWidth: 720 }}
            />
          </m.div>
        </MotionContainer>

        <StyledSectionBg />
      </StyledSection>

      <StyledContent>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
