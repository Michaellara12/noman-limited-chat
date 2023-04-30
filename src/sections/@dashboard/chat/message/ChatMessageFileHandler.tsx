// mui
import { Stack, Typography, Button } from '@mui/material';
// react
import React, { useState } from 'react';
//
import axios from "axios";
import useResponsive from 'src/hooks/useResponsive';
// icons
import SendIcon from '@mui/icons-material/Send';

// ----------------------------------------------------------------------

type Props = {
    leadPhoneNumber: string;
    chatroomId: string;
    handleClose: VoidFunction;
}

type FilesState = CustomFile | undefined;

interface CustomFile extends File {
    isUploading?: boolean;
}

export default function ChatMessageFileHandler({ leadPhoneNumber, chatroomId, handleClose }: Props) {

    const [fileData, setFileData] = useState({});

    const [fileName, setFileName] = useState("");

    const [files, setFiles] = useState<FilesState>();

    const [loading, setLoading] = useState(false);

    const isMobile = useResponsive('down', 'sm');

    const uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0] as CustomFile;
        var fileName = file.name;
        if(!file) return;
        file.isUploading = true;
        setFiles(file)

        // upload file
        const formData = new FormData();
        formData.append(
            "newFile",
            file,
            file.name,
        )

        formData.append(
            "chatroomId",
            chatroomId,
        )

        formData.append(
            "leadPhoneNumber",
            leadPhoneNumber,
        )
        
        setFileName(fileName);
        setFileData(formData);
    }


    const sendFile = () => {
        setLoading(true)
        axios.post('https://hook.us1.make.com/lvmoulc6gntm49p2tycthvawv86ghqxv', fileData)
        setFileData({});
        setLoading(false)
        handleClose()
    }

  return (
    <>
    {!isMobile
        ?
            <Stack alignItems='center' >
                <Typography variant='body2' sx={{ mt: 1 }}>PNG, JPG, JPEG Y PDF</Typography>
                <Stack direction='row' alignItems='center' spacing={1} sx={{mb: 1, mx: 1}}>
                    <input
                        type={"file"} 
                        onChange={uploadHandler}
                    />
                    <Button onClick={sendFile} variant='contained' disabled={loading} >
                        <SendIcon />
                    </Button>
                </Stack>
            </Stack>
        :
            <Stack alignItems='center' >
                <Typography variant='body2' sx={{ mt: 1 }}>PNG, JPG, JPEG Y PDF</Typography>
                <Stack alignItems='center' spacing={1} sx={{mb: 1, mx: 1}}>
                    <input
                        type={"file"} 
                        onChange={uploadHandler}
                    />
                    <Button onClick={sendFile} variant='contained' sx={{ width: '100%' }} disabled={loading} >
                        <SendIcon />
                    </Button>
                </Stack>
            </Stack>
    }
    </>
  )
}
