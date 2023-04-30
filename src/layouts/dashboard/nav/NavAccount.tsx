// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
//
import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();

  const [palabras, setPalabras] = useState(0)

  if (user) {
    const docRef = doc(DB, "users", user.uid)

    useEffect(() => {

      const fetchDocData = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const words = docSnap.data().palabras as number;
          setPalabras(words)
        }
      };
        fetchDocData();
      
      }, [])

  }

  return (
    <Link underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar src="/assets/illustrations/avatar-gradient.png" alt={user?.displayName} name={user?.displayName} />

        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>
{/* 
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            Palabras: {palabras}
          </Typography> */}
        </Box>
      </StyledRoot>
    </Link>
  );
}
