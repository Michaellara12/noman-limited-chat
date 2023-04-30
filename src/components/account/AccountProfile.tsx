// MUI
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
  } from '@mui/material';

import { useEffect, useState } from 'react';
import { DB } from 'src/auth/FirebaseContext';
import { getDoc, doc } from 'firebase/firestore';

import { useAuthContext } from 'src/auth/useAuthContext';

// <------------------------------------------> //

function AccountProfile() {

  const { user } = useAuthContext()

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
    <Card>
        <CardContent>
            <Box
                sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column'
                }}
            >
                <Avatar
                    src='/assets/illustrations/avatar-gradient.png'
                    sx={{
                        height: 80,
                        mb: 2,
                        width: 80
                    }}
                />
                <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h5"
                >
                    {user?.displayName}
                </Typography>
            </Box>
        </CardContent>
      
    </Card>
  )
}

export default AccountProfile