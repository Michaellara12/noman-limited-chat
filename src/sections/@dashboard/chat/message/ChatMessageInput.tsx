import { useRef, useState } from 'react';
// @mui
import { Stack, InputBase, InputBaseProps, IconButton, InputAdornment, Popover } from '@mui/material';
// @types
import { IChatTextMessage } from '../../../../@types/chat';
// components
import Iconify from '../../../../components/iconify';
import Picker from "emoji-picker-react";
import ChatMessageFileHandler from './ChatMessageFileHandler';

// ----------------------------------------------------------------------

interface Props extends InputBaseProps {
  conversationId: string;
  chatroomId: string;
  onSend: (value: IChatTextMessage) => Promise<void>
}

export default function ChatMessageInput({
  disabled,
  conversationId,
  chatroomId,
  onSend,
  // leadData,
  sx,
  ...other
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClickAttach = () => {
    fileInputRef.current?.click();
    console.log(fileInputRef)
  };

  const handleSend = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (onSend && message && conversationId) {
        onSend({
          leadPhoneNumber: conversationId,
          chatroomId: chatroomId,
          message,
          read: false,
          sender: 'team',
          timestamp: new Date(),
          type: 'text'
        });
      }
      setMessage('');
    }
  };

  const [isEmojiPicker, setIsEmojiPicker] = useState(false)

  // Emoji Picker Popover
  const open = Boolean(anchorEl);
  
  const id = open ? 'simple-popover' : undefined;

  const handleEmojiClick = (emojiObj: { emoji: string }) => {
    setMessage(message + emojiObj.emoji);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsEmojiPicker(true)
    setAnchorEl(event.currentTarget);
  };

  const handleFileHandlerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsEmojiPicker(false)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ width: '90%' }}
      >
        {isEmojiPicker
          ?
            <Picker 
              onEmojiClick={handleEmojiClick}
              width="100%"
            />
          :
            <ChatMessageFileHandler leadPhoneNumber={conversationId} chatroomId={chatroomId} handleClose={handleClose} />
        }
      </Popover>
      
      <InputBase
        value={message}
        onKeyUp={handleSend}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Escribe un mensaje"
        startAdornment={
          <InputAdornment position="start">
            <IconButton size="small" aria-describedby={id} onClick={handleClick}>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>

            <IconButton size="small" aria-describedby={id} onClick={handleFileHandlerClick}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          pl: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          ...sx,
        }}
        {...other}
      />

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </>
  );
}
