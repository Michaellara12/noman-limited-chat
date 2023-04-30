// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// icons
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// ----------------------------------------------------------------------

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: '',
    items: [
      { title: 'Informes', path: PATH_DASHBOARD.informes, icon: <InsertChartIcon /> },
      { title: 'Chat', path: PATH_DASHBOARD.chat.root, icon: <QuestionAnswerIcon /> },
      { title: 'Configurar chatbots', path: PATH_DASHBOARD.configuracion, icon: <SmartToyIcon /> },
      { title: 'Cuenta', path: PATH_DASHBOARD.cuenta, icon: <AccountCircleIcon /> },
    ],
  },
];

export default navConfig;
