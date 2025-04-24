import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { varAlpha, bgGradient } from 'src/theme/styles';

// ----------------------------------------------------------------------

type SectionProps = BoxProps & {
  title?: string;
  method?: string;
  imgUrl?: string;
  subtitle?: string;
  layoutQuery: Breakpoint;
  methods?: {
    path: string;
    icon: string;
    label: string;
  }[];
};

export function Section({
  sx,
  method,
  layoutQuery,
  methods,
  title = 'Manage the job',
  imgUrl = `${CONFIG.assetsDir}/assets/images/about/logoBlanco.svg`,
  subtitle = 'Transformando requerimientos en sistemas inteligentes.',
  ...other
}: SectionProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, rgba(0, 46, 138, 0.92), rgba(0, 2, 138, 0.92)`, // azul CODISA translúcido
          imgUrl: `${CONFIG.assetsDir}/assets/background/background-3-blur.webp`,
        }),
        px: 3,
        pb: 3,
        width: 1,
        maxWidth: 480,
        display: 'none',
        position: 'relative',
        pt: 'var(--layout-header-desktop-height)',
        [theme.breakpoints.up(layoutQuery)]: {
          gap: 8,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        },
        ...sx,
      }}
      {...other}
    >
      <div>
        <img
          src="/assets/images/about/LINKER_WHT.svg"
          alt="Logo"
          style={{
            display: 'block',
            margin: '0 auto',
            width: '120px',
            height: 'auto',
            opacity: 0,
            animation: 'fadeIn 1s ease-in-out forwards',
          }}
        />

        {subtitle && (
          <Typography
            sx={{
              color: '#FFFFFF',
              textAlign: 'center',
              mt: 2,
              display: 'block',
              margin: '5 auto',
              width: 'auto',
              height: 'auto',
              animation: 'fadeIn 1s ease-in-out forwards',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </div>

      <style>
        {`
    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }
  `}
      </style>

      <Box
        component="img"
        alt="Dashboard illustration"
        src={imgUrl}
        sx={{ width: 1, aspectRatio: '2/2', objectFit: 'cover' }}
      />
    </Box>
  );
}
