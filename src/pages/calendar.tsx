import { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import subMonths from 'date-fns/subMonths';
import { enUS } from 'date-fns/locale';

import { Box, Flex, Text, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  EventType,
  EventStatus,
  useCalendarEventsBySupplierQuery,
  useCreateCalendarEventMutation,
  useCancelCalendarEventMutation,
} from '@generated';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-US': enUS },
});

const sectionStyle: React.CSSProperties = {
  background: solvoColors.surface,
  border: `1px solid ${solvoColors.border}`,
  borderRadius: '16px',
  padding: '20px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontFamily: solvoFonts.sans,
  fontSize: '14px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: solvoColors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '6px',
  display: 'block',
};

const formatDt = (d: Date): string => format(d, "yyyy-MM-dd'T'HH:mm");

type RBEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    eventType: EventType;
    status: EventStatus;
    bookingId?: number | null;
    notes?: string | null;
    location?: string | null;
  };
};

type Mode = 'create' | 'view';

export default function CalendarPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const supplierId = user?.supplierId ?? null;

  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('month');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal state
  const [modal, setModal] = useState<{
    mode: Mode;
    event?: RBEvent;
    startsAt: string;
    endsAt: string;
    title: string;
    notes: string;
    location: string;
    allDay: boolean;
  } | null>(null);

  const range = useMemo(() => {
    // Pad the visible month by 1 month on each side so navigating doesn't refetch
    return {
      from: subMonths(startOfMonth(viewDate), 1),
      to: addMonths(endOfMonth(viewDate), 1),
    };
  }, [viewDate]);

  const { data, refetch, loading } = useCalendarEventsBySupplierQuery({
    variables: supplierId
      ? { supplierId, from: range.from.toISOString(), to: range.to.toISOString() }
      : (undefined as any),
    skip: !supplierId,
    fetchPolicy: 'network-only',
  });

  const events: RBEvent[] = useMemo(() => {
    const raw = data?.calendarEventsBySupplier ?? [];
    return raw.map((e: any) => ({
      id: e.calendarEventId,
      title: e.title,
      start: new Date(e.startsAt),
      end: new Date(e.endsAt),
      resource: {
        eventType: e.eventType,
        status: e.status,
        bookingId: e.bookingId,
        notes: e.notes,
        location: e.location,
      },
    }));
  }, [data]);

  const [createEvent, createState] = useCreateCalendarEventMutation();
  const [cancelEvent, cancelState] = useCancelCalendarEventMutation();
  const submitting = createState.loading || cancelState.loading;

  const handleSelectSlot = (slot: { start: Date; end: Date }) => {
    setModal({
      mode: 'create',
      startsAt: formatDt(slot.start),
      endsAt: formatDt(slot.end),
      title: 'Blocked time',
      notes: '',
      location: '',
      allDay: false,
    });
  };

  const handleSelectEvent = (event: RBEvent) => {
    setModal({
      mode: 'view',
      event,
      startsAt: formatDt(event.start),
      endsAt: formatDt(event.end),
      title: event.title,
      notes: event.resource.notes ?? '',
      location: event.resource.location ?? '',
      allDay: false,
    });
  };

  const handleCreate = async () => {
    if (!supplierId || !modal) return;
    try {
      await createEvent({
        variables: {
          data: {
            supplierId,
            eventType: EventType.Blocked,
            title: modal.title || 'Blocked time',
            notes: modal.notes || null,
            startsAt: new Date(modal.startsAt).toISOString(),
            endsAt: new Date(modal.endsAt).toISOString(),
            allDay: modal.allDay,
            location: modal.location || null,
          } as any,
        },
      });
      setFeedback('Time blocked on your calendar.');
      setModal(null);
      await refetch();
    } catch (err: any) {
      setFeedback(err?.message ?? 'Failed to create event');
    }
  };

  const handleCancel = async () => {
    if (!modal?.event) return;
    try {
      await cancelEvent({
        variables: { data: { calendarEventId: modal.event.id } },
      });
      setFeedback('Event removed from your calendar.');
      setModal(null);
      await refetch();
    } catch (err: any) {
      setFeedback(err?.message ?? 'Failed to cancel event');
    }
  };

  const eventPropGetter = (event: RBEvent) => {
    let bg = solvoColors.indigoLight;
    let color = solvoColors.indigo;
    let border = solvoColors.indigoBorder;
    if (event.resource.eventType === 'BOOKING') {
      bg = solvoColors.successLight;
      color = solvoColors.successText;
      border = solvoColors.emerald;
    } else if (event.resource.eventType === 'BLOCKED') {
      bg = solvoColors.roseLight;
      color = solvoColors.roseText;
      border = solvoColors.roseText;
    }
    if (event.resource.status === 'CANCELLED' || event.resource.status === 'COMPLETED') {
      bg = '#F5F5F4';
      color = solvoColors.textSubtle;
      border = solvoColors.border;
    }
    return {
      style: {
        background: bg,
        color,
        border: `1px solid ${border}`,
        borderRadius: '6px',
        padding: '2px 6px',
        fontSize: '12px',
        fontWeight: 500,
      },
    };
  };

  // ── Gates ───────────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/calendar" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              Sign in to view your calendar
            </Text>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Box
                display="inline-block"
                padding="10px 18px"
                borderRadius="10px"
                bg={solvoColors.text}
                color={solvoColors.surface}
                fontWeight={600}
                fontSize="14px"
                cursor="pointer"
                marginTop="12px"
              >
                Sign in
              </Box>
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  }

  if (!supplierId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/calendar" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              This page is for suppliers
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Only supplier accounts have a calendar.
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/calendar" />

      <Box maxWidth="1200px" margin="0 auto" padding="32px 24px">
        <Flex align="center" justify="space-between" marginBottom="24px" wrap="wrap" gap="12px">
          <Box>
            <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.1em" textTransform="uppercase" marginBottom="8px">
              Hi, {user.name}
            </Text>
            <Text as="h1" fontFamily={solvoFonts.serif} fontSize="36px" color={solvoColors.text}>
              Your calendar
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted} marginTop="4px">
              Bookings appear automatically. Click an empty slot to block unavailable time.
            </Text>
          </Box>
          <Flex gap="14px" align="center">
            <Flex align="center" gap="6px">
              <Box width="10px" height="10px" borderRadius="3px" bg={solvoColors.successLight} border={`1px solid ${solvoColors.emerald}`} />
              <Text fontSize="xs" color={solvoColors.textMuted}>Booking</Text>
            </Flex>
            <Flex align="center" gap="6px">
              <Box width="10px" height="10px" borderRadius="3px" bg={solvoColors.roseLight} border={`1px solid ${solvoColors.roseText}`} />
              <Text fontSize="xs" color={solvoColors.textMuted}>Blocked</Text>
            </Flex>
          </Flex>
        </Flex>

        {feedback && (
          <Box
            marginBottom="14px"
            padding="10px 14px"
            borderRadius="10px"
            bg={solvoColors.successLight}
            color={solvoColors.successText}
          >
            <Text fontSize="sm">{feedback}</Text>
          </Box>
        )}

        <Box
          style={sectionStyle}
          padding="14px"
        >
          <div style={{ height: '680px' }}>
            <Calendar<RBEvent>
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              date={viewDate}
              view={view}
              onNavigate={(d) => setViewDate(d)}
              onView={(v) => setView(v)}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventPropGetter}
              views={['month', 'week', 'day', 'agenda']}
              popup
              style={{ height: '100%', fontFamily: solvoFonts.sans, fontSize: '14px' }}
            />
          </div>
        </Box>
        {loading && (
          <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="8px">
            Loading…
          </Text>
        )}
      </Box>

      {/* Create / view event modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            key="cal-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(28, 25, 23, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '460px',
                background: solvoColors.surface,
                borderRadius: '20px',
                boxShadow: solvoShadows.heroInput,
              }}
            >
              <Flex
                align="center"
                justify="space-between"
                padding="18px 22px"
                borderBottom={`1px solid ${solvoColors.border}`}
              >
                <Flex align="center" gap="10px">
                  {modal.mode === 'create' ? (
                    <Lock size={18} color={solvoColors.roseText} />
                  ) : modal.event?.resource.eventType === 'BOOKING' ? (
                    <CalendarIcon size={18} color={solvoColors.emeraldText} />
                  ) : (
                    <Lock size={18} color={solvoColors.roseText} />
                  )}
                  <Text fontFamily={solvoFonts.serif} fontSize="18px" color={solvoColors.text}>
                    {modal.mode === 'create' ? 'Block time' : modal.event?.title}
                  </Text>
                </Flex>
                <Box
                  as="button"
                  onClick={() => setModal(null)}
                  width="30px"
                  height="30px"
                  borderRadius="9px"
                  bg="transparent"
                  border={`1px solid ${solvoColors.border}`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                >
                  <X size={14} color={solvoColors.text} />
                </Box>
              </Flex>

              <Box padding="20px 22px">
                {modal.mode === 'create' ? (
                  <>
                    <Box marginBottom="12px">
                      <label style={labelStyle}>Title</label>
                      <input
                        type="text"
                        value={modal.title}
                        onChange={(e) => setModal({ ...modal, title: e.target.value })}
                        style={inputStyle}
                      />
                    </Box>
                    <Flex gap="10px" wrap="wrap" marginBottom="12px">
                      <Box flex="1" minWidth="180px">
                        <label style={labelStyle}>Starts</label>
                        <input
                          type="datetime-local"
                          value={modal.startsAt}
                          onChange={(e) => setModal({ ...modal, startsAt: e.target.value })}
                          style={inputStyle}
                        />
                      </Box>
                      <Box flex="1" minWidth="180px">
                        <label style={labelStyle}>Ends</label>
                        <input
                          type="datetime-local"
                          value={modal.endsAt}
                          onChange={(e) => setModal({ ...modal, endsAt: e.target.value })}
                          style={inputStyle}
                        />
                      </Box>
                    </Flex>
                    <Box marginBottom="12px">
                      <label style={labelStyle}>Notes (optional)</label>
                      <textarea
                        value={modal.notes}
                        onChange={(e) => setModal({ ...modal, notes: e.target.value })}
                        rows={2}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </Box>
                    <button
                      type="button"
                      onClick={handleCreate}
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: solvoColors.text,
                        color: solvoColors.surface,
                        fontWeight: 600,
                        fontSize: '14px',
                        fontFamily: solvoFonts.sans,
                        cursor: 'pointer',
                        opacity: submitting ? 0.5 : 1,
                      }}
                    >
                      {submitting ? 'Saving…' : 'Block this time'}
                    </button>
                  </>
                ) : (
                  <>
                    <Box marginBottom="14px">
                      <Text fontSize="xs" color={solvoColors.textSubtle} textTransform="uppercase" letterSpacing="0.04em" marginBottom="2px">
                        Type
                      </Text>
                      <Text fontSize="sm" color={solvoColors.text} fontWeight={600}>
                        {modal.event?.resource.eventType}
                      </Text>
                    </Box>
                    <Box marginBottom="14px">
                      <Text fontSize="xs" color={solvoColors.textSubtle} textTransform="uppercase" letterSpacing="0.04em" marginBottom="2px">
                        When
                      </Text>
                      <Text fontSize="sm" color={solvoColors.text}>
                        {format(new Date(modal.startsAt), 'PP, p')} → {format(new Date(modal.endsAt), 'p')}
                      </Text>
                    </Box>
                    {modal.event?.resource.location && (
                      <Box marginBottom="14px">
                        <Text fontSize="xs" color={solvoColors.textSubtle} textTransform="uppercase" letterSpacing="0.04em" marginBottom="2px">
                          Location
                        </Text>
                        <Text fontSize="sm" color={solvoColors.text}>{modal.event.resource.location}</Text>
                      </Box>
                    )}
                    {modal.event?.resource.notes && (
                      <Box marginBottom="14px">
                        <Text fontSize="xs" color={solvoColors.textSubtle} textTransform="uppercase" letterSpacing="0.04em" marginBottom="2px">
                          Notes
                        </Text>
                        <Text fontSize="sm" color={solvoColors.text}>{modal.event.resource.notes}</Text>
                      </Box>
                    )}
                    {modal.event?.resource.bookingId && (
                      <Box
                        marginBottom="14px"
                        padding="10px 12px"
                        borderRadius="10px"
                        bg={solvoColors.bg}
                      >
                        <Text fontSize="xs" color={solvoColors.textMuted}>
                          This event is linked to booking <strong>#{modal.event.resource.bookingId}</strong>. To cancel or complete it, go to the bookings page.
                        </Text>
                      </Box>
                    )}
                    {modal.event?.resource.eventType !== 'BOOKING' && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={submitting}
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          border: `1px solid ${solvoColors.border}`,
                          background: solvoColors.surface,
                          color: solvoColors.roseText,
                          fontWeight: 600,
                          fontSize: '14px',
                          fontFamily: solvoFonts.sans,
                          cursor: 'pointer',
                          opacity: submitting ? 0.5 : 1,
                        }}
                      >
                        Remove this block
                      </button>
                    )}
                  </>
                )}
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
