// next
import Router from 'next/router';
// react
import { useState, useEffect } from 'react';
// mui
import { MenuItem, FormControl, SelectChangeEvent, Select, InputLabel, Box, Skeleton } from '@mui/material';
// firebase 
import { DB } from 'src/auth/FirebaseContext';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
//
import { ScanQRCodeDialog } from 'src/components/dialog';
// paths
import { PATH_DASHBOARD } from 'src/routes/paths';
// icons
import AddIcCallIcon from '@mui/icons-material/AddIcCall';

// ----------------------------------------------------------------------

type Props = {
  chatroomId: string
}

type ChatroomProps = {
  [key: string]: string
} 

export default function ChatNavSelectInput({ chatroomId }: Props) {

  const [loading, setLoading] = useState(true);

  const [chatrooms, setChatrooms] = useState<ChatroomProps>()

  const [phoneNumbers, setPhoneNumbers] = useState([])

  const [openDialog, setOpenDialog] = useState(false)

  const { user } = useAuthContext()

  function getKeyByValue(object: ChatroomProps, value: string) {
    return Object.keys(object).find(key => object[key] === value);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === 'addWPNumber') {
      setOpenDialog(true)
    } else if (chatrooms) {
      const chatroomId = getKeyByValue(chatrooms, event.target.value) as string
      Router.push(PATH_DASHBOARD.chat.view(chatroomId))
    }
  };

  async function getChatroomsIds() {
    const docRef = doc(DB, "users", user?.uid)
    const docData = await getDoc(docRef)
    if (docData.exists()) {
      const chatroomsData = docData.data().chatrooms
      setChatrooms(chatroomsData)
      setPhoneNumbers(Object.values(chatroomsData))
    } else {
      return
    }
  }

  useEffect(() => {
    getChatroomsIds()
  }, [])

  useEffect(() => {
    if (chatrooms !== undefined && phoneNumbers.length !== 0) {
      setLoading(false)
    } 
    return
  }, [phoneNumbers, chatrooms])

  return (
    <Box sx={{ width: '100%', p: 1 }}>

    <ScanQRCodeDialog open={openDialog} handleClose={handleCloseDialog} />

      {loading
        ?
          <Skeleton />
        :
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Línea de WhatsApp</InputLabel>
            <Select
              value={chatrooms?.[chatroomId]}
              label="Línea de WhatsApp"
              onChange={handleChange}
            >
              {phoneNumbers.map((phoneNumber) => <MenuItem key={phoneNumber} value={phoneNumber}>{phoneNumber}</MenuItem>)}
              <MenuItem dense value='addWPNumber'><AddIcCallIcon sx={{mr: 1}}/>Agregar número</MenuItem>
            </Select>
          </FormControl>
      }
    </Box>
  );
}