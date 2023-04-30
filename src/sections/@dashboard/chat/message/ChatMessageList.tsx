//next
import { useRouter } from 'next/router';
// react
import { useEffect, useState, useRef } from 'react';
// @mui
import { Box, CircularProgress } from '@mui/material';
// @types
import { IChatTextMessage } from '../../../../@types/chat';
//
import Scrollbar from '../../../../components/scrollbar';
//
import ChatMessageItem from './ChatMessageItem';

// firebase
import { DB } from 'src/auth/FirebaseContext';
import { doc, collection, onSnapshot, orderBy, query, QuerySnapshot, DocumentData, updateDoc } from 'firebase/firestore';

// ----------------------------------------------------------------------

export default function ChatMessageList() {

  const scrollRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true)

  const [messages, setMessages] = useState<IChatTextMessage[]>([])

  // const [selectedImage, setSelectedImage] = useState<number>(-1);

  const { query: { conversationKey, chatroomId } } = useRouter();

  useEffect(() => {
    async function getMessages() {
      const collectionRef = collection(DB, "chatrooms", chatroomId as string, "conversations", conversationKey as string, "messages")
      const q = query(collectionRef, orderBy("timestamp", "asc"));
      const unsubscribe = onSnapshot(q, ((snapshot:QuerySnapshot<DocumentData>) => {
          const messages = snapshot.docs.map((doc) => {
            return { ...doc.data() } as IChatTextMessage
          });
          setMessages(messages)
        }));
        return () => {
          unsubscribe();
        };
    }
    getMessages();
  }, [conversationKey])

  async function markMessageAsSeen() {
    const docRef = doc(DB, 'chatrooms', chatroomId as string, 'conversations', conversationKey as string)
    await updateDoc(docRef, { unreadCount: 0 });
  }

  useEffect(() => {
    if (messages?.length !== 0) {
        setLoading(false)
    }
    return; 
  }, [messages])

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
    markMessageAsSeen();
  }, []); // empty array as the second argument to run only once
  
  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
    markMessageAsSeen();
  }, [conversationKey, messages]); // add messages to the dependency array to run when messages change

  // const imagesLightbox = messages
  //   .filter((message) => message.type === 'image')
  //   .map((message) => ({ src: message.message, alt: message.message }));

  // const handleOpenLightbox = (imageUrl: string) => {
  //   const imageIndex = imagesLightbox.findIndex((image) => image.src === imageUrl);
  //   setSelectedImage(imageIndex);
  // };

  // const handleCloseLightbox = () => {
  //   setSelectedImage(-1);
  // };

  return (
    <>
        <Scrollbar
            scrollableNodeProps={{
              ref: scrollRef,
            }}
            sx={{ p: 3, height: 1 }}
        >
          {loading
            ?
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <CircularProgress />
              </Box>
            :
              messages?.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                />
              ))
          }
          
        </Scrollbar>

    </>
  );
}

