import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';

// Firebase
import { DB } from 'src/auth/FirebaseContext';
import { doc, updateDoc, onSnapshot } from "firebase/firestore"; 
import { useAuthContext } from 'src/auth/useAuthContext';

// 
import { useSnackbar } from "src/components/snackbar"
import { SelectChangeEvent } from '@mui/material';

// <--------------------------------------->//

export default function AccountProfileDetails() {

  const { user } = useAuthContext()

  const docRef = doc(DB, "users", user?.uid)

  const { enqueueSnackbar } = useSnackbar();

  const [values, setValues] = useState({
    nombre: user?.displayName,
    userEmail: user?.email,
    chatbotName: '',
    chatbotPhone: '',
    chatbotJob: '',
    chatbotInfo: ''
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const unsubscribe = onSnapshot(docRef, (doc) => {
        setValues({
          ...values,
          chatbotName: doc.data()?.chatbotName,
          chatbotPhone: doc.data()?.chatbotPhone,
          chatbotJob: doc.data()?.chatbotJob,
          chatbotInfo: doc.data()?.chatbotInfo
        })
    })

    return unsubscribe
    
  }, [])

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleChangeSelector = (event:SelectChangeEvent<string>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  async function updateChatbotInfo(e:React.MouseEvent<HTMLElement>) {
      e.preventDefault()
      setLoading(true)
      await updateDoc(docRef, {
        chatbotName: values.chatbotName,
        chatbotPhone: values.chatbotPhone,
        chatbotJob: values.chatbotJob,
        chatbotInfo: values.chatbotInfo
      })

      // setOpen(true)
      setLoading(false)
      enqueueSnackbar('Información del chatbot actualizada')
  }

  const handleClose = (event:React.MouseEvent<HTMLElement>, reason:string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
    <form
      autoComplete="off"
      noValidate
    >
      <Card>
        <CardHeader
          subheader="Edita tu información personal"
          title="Perfil"
          sx={{
            mb: '1.6rem'
          }}
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                name="nombre"
                onChange={handleChange}
                required
                value={values.nombre}
                variant="outlined"
                disabled
              />
            </Grid>

          
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                name="userEmail"
                onChange={handleChange}
                required
                value={values.userEmail}
                variant="outlined"
                disabled
                type="email"
              />
            </Grid>
           
          </Grid>
        </CardContent>
        <Divider />

        <Divider />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          
          <Button
            color="primary"
            variant="contained"
            // disabled={loading}
            disabled={true}
            onClick={updateChatbotInfo}
          >
            Guardar
          </Button>
        </Box>
      </Card>
    </form>
    </>
  );
};
