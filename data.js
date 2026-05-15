var storyData = {

  // Escena 1 — El tamaño del problema
  global: {
    total: 117398,
    canceled: 44010,
    notCanceled: 73388,
    cancelRate: 37.5,
    notCanceledRate: 62.5
  },

  // Escena 2 — Dos hoteles, dos comportamientos
  byHotel: [
    { hotel: "City Hotel",   bookings: 78091, canceled: 32972, notCanceled: 45119, cancelRate: 42.2 },
    { hotel: "Resort Hotel", bookings: 39307, canceled: 11038, notCanceled: 28269, cancelRate: 28.1 }
  ],

  // Escena 3 — El canal revela incertidumbre
  byChannel: [
    { channel: "TA/TO",      bookings: 96888, canceled: 40064, notCanceled: 56824, cancelRate: 41.4 },
    { channel: "Corporate",  bookings:  6483, canceled:  1448, notCanceled:  5035, cancelRate: 22.3 },
    { channel: "GDS",        bookings:   189, canceled:    37, notCanceled:   152, cancelRate: 19.6 },
    { channel: "Direct",     bookings: 13833, canceled:  2457, notCanceled: 11376, cancelRate: 17.8 }
  ],

  // Escena 4 — El clímax: la anticipación
  byLeadTime: [
    { group: "0 días",    bookings:  5767, canceled:   387, notCanceled:  5380, cancelRate:  6.7 },
    { group: "1–7",       bookings: 12834, canceled:  1416, notCanceled: 11418, cancelRate: 11.0 },
    { group: "8–30",      bookings: 18648, canceled:  5248, notCanceled: 13400, cancelRate: 28.1 },
    { group: "31–90",     bookings: 29294, canceled: 11112, notCanceled: 18182, cancelRate: 37.9 },
    { group: "91–180",    bookings: 26304, canceled: 11802, notCanceled: 14502, cancelRate: 44.9 },
    { group: "181–365",   bookings: 21422, canceled: 11918, notCanceled:  9504, cancelRate: 55.6 },
    { group: "> 365",     bookings:  3129, canceled:  2127, notCanceled:  1002, cancelRate: 68.0 }
  ],

  // Escena 5 — Señales de compromiso (agrupado)
  bySpecialRequestsGrouped: [
    { group: "Sin peticiones",       bookings: 69123, canceled: 33403, notCanceled: 35720, cancelRate: 48.3 },
    { group: "Con peticiones (\u22651)", bookings: 48275, canceled: 10607, notCanceled: 37668, cancelRate: 22.0 }
  ],

  // Escena 5 — Señales de compromiso (detalle para hover)
  bySpecialRequests: [
    { requests: 0, bookings: 69123, canceled: 33403, notCanceled: 35720, cancelRate: 48.3 },
    { requests: 1, bookings: 32720, canceled:  7279, notCanceled: 25441, cancelRate: 22.2 },
    { requests: 2, bookings: 12755, canceled:  2849, notCanceled:  9906, cancelRate: 22.3 },
    { requests: 3, bookings:  2436, canceled:   442, notCanceled:  1994, cancelRate: 18.1 },
    { requests: 4, bookings:   324, canceled:    35, notCanceled:   289, cancelRate: 10.8 },
    { requests: 5, bookings:    40, canceled:     2, notCanceled:    38, cancelRate:  5.0 }
  ]
};
