import { useEffect, useState } from 'react';
// @mui
import { Stack, Typography, Skeleton, Switch, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
// utils
import { fToNow } from '../../../../utils/formatTime';
// @types
import { ILeadProfile } from 'src/@types/chat';
// components
import Iconify from '../../../../components/iconify';
import { CustomAvatar } from '../../../../components/custom-avatar';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { updateDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';

// ----------------------------------------------------------------------

type Props = {
    leadData: ILeadProfile | undefined;
    chatroomId: string;
    conversationKey: string;
}

export default function ChatHeaderDetail({ chatroomId, conversationKey }: Props) {

  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)

  const [leadData, setLeadData] = useState<ILeadProfile>()

  const [isNomanActive, setIsNomanActive] = useState(false)

  // useEffect(() => {
  //   async function getLeadData() {
  //     const docRef = doc(DB, "chatrooms", chatroomId as string, "conversations", conversationKey as string)
  //     const leadData = await getDoc(docRef)
  //     if (leadData.exists()) {
  //       setLeadData({...leadData.data()} as ILeadProfile)
  //       setIsNomanActive(leadData.data().isNomanActive)
  //     } else {
  //       console.log('error')
  //     }
  //   }
  //   getLeadData();
  // }, [conversationKey, leadData?.isNomanActive])

  useEffect(() => {
    const docRef = doc(DB, "chatrooms", chatroomId as string, "conversations", conversationKey as string)
  
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setLeadData({...doc.data()} as ILeadProfile)
        setIsNomanActive(doc.data().isNomanActive)
      } else {
        console.log('error')
      }
    })
  
    return () => unsubscribe()
  }, [chatroomId, conversationKey])
  

  useEffect(() => {
    if (!!leadData) {
        setLoading(false)
    }
    return; 
  }, [leadData])

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  async function handleIsNomanActiveState() {
    handleClose()
    const docRef = doc(DB, 'chatrooms', chatroomId, 'conversations', conversationKey)
    await updateDoc(docRef, { isNomanActive: !leadData?.isNomanActive })
  }

  return (
    <>
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 1, 2, 2),
      }}
    >
        <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
          {loading
            ?
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={40} height={40} />
                <Stack>
                  <Skeleton width={100} height={15} />
                  <Skeleton width={60} height={15} />
                </Stack>
              </Stack>
            :
                <>
                <CustomAvatar
                    src={leadData?.profilePic}
                    alt={leadData?.name}
                />

                <Stack>
                    <Typography variant="subtitle2">{leadData?.name}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {leadData?.lastActivity.toDate().getTime() && fToNow(leadData.lastActivity.toDate().getTime())}
                    </Typography>
                </Stack>
                </>
          }
          
        </Stack>
  
      <Switch checked={isNomanActive} onClick={handleOpen} />

      <IconButton>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>

    {/* Turn Noman Off */}
    <Dialog open={open} onClose={handleClose}>
      {isNomanActive
        ?
          <>
            <DialogTitle>¿En verdad deseas apagar a Noman?</DialogTitle>
            <DialogContent>
              Noman dejará de comunicarse con este usuario. <br/>Puedes encender a Noman una vez más haciendo click en el switch que esta en la parte superior derecha.
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant='contained'>Cancelar</Button>
              <Button onClick={handleIsNomanActiveState} >Apagar</Button>
            </DialogActions>
          </>
        :
          <>
            <DialogTitle>¿Deseas encender a Noman?</DialogTitle>
            <DialogContent>
              Noman va a retomar la conversación donde la dejaste ;)<br/>Cualquier mensaje que enviaste va a quedar almacenado en la memoria de Noman.
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button variant='contained' onClick={handleIsNomanActiveState} >Encender</Button>
            </DialogActions>
          </>
      }
    </Dialog>
    </>
  );
}