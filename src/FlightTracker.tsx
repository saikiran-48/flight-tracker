import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Box,
  useTheme,
} from '@mui/material';
import { API_KEY, BASE } from './constants/constants';

export default function FlightTracker() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [flight, setFlight] = useState<any>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setFlight(null);

    const q = input.trim();
    if (!q) return setError('Enter a flight number like AI188 or 188');

    const params = new URLSearchParams({ access_key: API_KEY, limit: '30' });
    if (/^[A-Za-z]{1,3}\d/.test(q)) params.set('flight_iata', q.toUpperCase());
    else params.set('flight_number', q);

    setLoading(true);
    try {
      const res = await fetch(`${BASE}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = json.data || [];
      if (!list.length) return setError('No flights found');
      const best =
        list.find((f: any) => ['active', 'scheduled', 'en route'].includes((f.flight_status || '').toLowerCase())) ||
        list[0];
      setFlight(best);
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const FlightCard = ({ f }: { f: any }) => {
    if (!f) return null;
    const dep = f.departure || {};
    const arr = f.arrival || {};
    const airline = f.airline?.name || '-';
    const flightId = f.flight?.iata || f.flight?.number || '-';

    const V = (v: any) => (v === null || v === undefined || v === '' ? '-' : v);

    const depShort = dep.scheduled ? new Date(dep.scheduled) : dep.scheduledTime ? new Date(dep.scheduledTime) : null;
    const arrShort = arr.scheduled ? new Date(arr.scheduled) : arr.scheduledTime ? new Date(arr.scheduledTime) : null;
    const depTime = depShort ? depShort.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '-';
    const arrTime = arrShort ? arrShort.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '-';
    const depDate = depShort ? depShort.toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';
    const arrDate = arrShort ? arrShort.toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';

    const toYear = (iso?: string) => (iso ? new Date(iso).getFullYear() : '');

    const statusIsActive = (f.flight_status || f.status || '').toLowerCase() === 'active';
    const statusText = (f.flight_status || f.status || '-').toUpperCase();

    return (
      <Card sx={styles.card} variant="outlined">
        <CardContent sx={styles.cardContent}>
          <Box sx={styles.header}>
            <Box>
              <Typography sx={styles.airline}>{airline.toUpperCase()}</Typography>
              <Typography sx={styles.flightMeta}>
                Flight: <strong>{flightId}</strong> • Status:
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: statusIsActive ? styles.statusActive.color : styles.statusDefault.color,
                  }}
                >
                  {statusText}
                </Box>
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={styles.timetable}>
            <Box sx={styles.col}>
              <Typography sx={styles.subtitle}>Departure from {dep.iata || '-'}</Typography>

              <Typography sx={styles.timeHighlighted}>{depTime}</Typography>
              {depDate && (
                <Typography variant="caption" color="text.secondary">
                  {depDate} {toYear(dep.scheduled)}
                </Typography>
              )}

              <Typography sx={styles.airportName}>{V(dep.airport)}</Typography>

              <Stack direction="row" spacing={2} sx={styles.metaRow}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Terminal
                  </Typography>
                  <Typography variant="body2">{V(dep.terminal)}</Typography>
                </Box>

                {dep.gate && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Gate
                    </Typography>
                    <Typography variant="body2">{V(dep.gate)}</Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Delay
                  </Typography>
                  <Typography variant="body2">{V(dep.delay ?? '-')} min</Typography>
                </Box>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Estimated:{' '}
                {V(new Date(dep.estimated || dep.estimatedTime || '').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })) ||
                  '-'}
              </Typography>
            </Box>

            <Box sx={styles.dividerBox} />

            <Box sx={styles.col}>
              <Typography sx={styles.subtitle}>Arrival to {arr.iata || '-'}</Typography>

              <Typography sx={styles.timeHighlighted}>{arrTime}</Typography>
              {arrDate && (
                <Typography variant="caption" color="text.secondary">
                  {arrDate} {toYear(arr.scheduled)}
                </Typography>
              )}

              <Typography sx={styles.airportName}>{V(arr.airport)}</Typography>

              <Stack direction="row" spacing={2} sx={styles.metaRow}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Terminal
                  </Typography>
                  <Typography variant="body2">{V(arr.terminal)}</Typography>
                </Box>

                {arr.gate && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Gate
                    </Typography>
                    <Typography variant="body2">{V(arr.gate)}</Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Baggage
                  </Typography>
                  <Typography variant="body2">{V(arr.baggage ?? '-')}</Typography>
                </Box>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Estimated:{' '}
                {V(new Date(arr.estimated || arr.estimatedTime || '').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })) ||
                  '-'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={styles.footer}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Airline
              </Typography>
              <Typography variant="body2">{V(f.airline?.name)}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Flight
              </Typography>
              <Typography variant="body2">{V(f.flight?.iata || f.flight?.number)}</Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Flight date
              </Typography>
              <Typography variant="body2">{V(f.flight_date)}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

// #region TSX
  return (
    <Box sx={styles.container}>
      <Card sx={styles.wrapperCard}>
        <CardContent>
          <Stack spacing={2}>
            <Typography sx={styles.title}>Flight Tracker</Typography>

            <form onSubmit={handleSearch}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={styles.inputRow}>
                <TextField
                  label="Flight number (e.g. AI188)"
                  value={input}
                  onChange={(e: any) => setInput(e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : 'Track'}
                </Button>
              </Stack>
            </form>

            <Typography variant="body2" color="text.secondary">
              Enter a flight number to view schedule and status. Data comes from Aviationstack.
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {flight && <FlightCard f={flight} />}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}


// #region Styles
function getStyles(theme: any) {
  return {
    container: {
      p: { xs: 2, md: 4 },
      maxWidth: 980,
      mx: 'auto',
    },
    wrapperCard: {
      borderRadius: 2,
    },
    title: {
      fontWeight: 800,
    },
    inputRow: {
      alignItems: 'center',
    },
    card: {
      mt: 2,
      borderRadius: 2,
      boxShadow: 2,
    },
    cardContent: {
      p: { xs: 2, md: 3 },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      mb: 1,
    },
    airline: {
      fontWeight: 700,
    },
    flightMeta: {
      color: 'text.secondary',
    },
    statusActive: {
      color: '#1db954',
    },
    statusDefault: {
      color: 'text.primary',
    },
    planeImg: {
      width: { xs: 40, sm: 56 },
      height: 'auto',
      objectFit: 'contain',
      filter: theme.palette.mode === 'dark' ? 'brightness(0.95)' : 'none',
    },
    timetable: {
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 3,
    },
    col: {
      flex: 1,
      minWidth: 220,
    },
    subtitle: {
      color: 'text.secondary',
      mb: 0.5,
    },
    timeHighlighted: {
      fontSize: { xs: 20, md: 22 },
      fontWeight: 700,
      color: '#1db954',
    },
    airportName: {
      mt: 1,
    },
    metaRow: {
      mt: 1,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    dividerBox: {
      width: { xs: '100%', md: 1 },
      height: { xs: 1, md: 'auto' },
      background: { xs: 'transparent', md: 'rgba(0,0,0,0.06)' },
      alignSelf: 'stretch',
    },
    footer: {
      display: 'flex',
      gap: 3,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  };
}
